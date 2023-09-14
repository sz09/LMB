import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { LiteFile } from '../../../models/lite-file';
import { NewsPaperPost } from '../../../models/news-paper-post';
import { format } from '../../../services/extentions';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { NewsPaperPostService } from '../../../services/news-paper-post.service';

@Component({
  selector: 'app-news-paper-post-admin',
  templateUrl: './news-paper-post-admin.component.html',
  styleUrls: ['./news-paper-post-admin.component.css']
})
export class NewsPaperPostAdminComponent {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: NewsPaperPost[] = [];
  readonly defaultPageSize: number = 10;
  readonly defaultSort: string = 'Hint asc';
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: this.defaultSort,
      Page: 0,
      PageSize: this.defaultPageSize,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'NewsPaper.Link',
    'NewsPaper.Hint',
    'NewsPaper.UploadedImage',
    'NewsPaper.EmptyData',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  /*  bsEditorModalRef!: BsModalRef;*/

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('linkTemplate')
  linkTemplate!: TemplateRef<any>;
  @ViewChild('imagesTemplate')
  imagesTemplate!: TemplateRef<any>;
  @ViewChild('hintTemplate')
  hintTemplate!: TemplateRef<any>;
  constructor(
    private _newsPaperPostlService: NewsPaperPostService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.loadColumn());
  }

  loadData() {
    showLoading();
    this._newsPaperPostlService.searchAdmin(this.payload).subscribe(d => {
      this.rows = d.Data;
      this.totalRows = d.Total;
      this.total = this.rows.length;
      hideLoading();
    })
  }

  loadColumn() {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
      this.gridMessage.emptyMessage = this._translateTexts['NewsPaper.EmptyData'];
      this.columns = [
        {
          minWidth: 100,
          name: this._translateTexts['NewsPaper.Hint'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.hintTemplate,
        },
        {
          width: 200,
          name: this._translateTexts['NewsPaper.UploadedImage'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.imagesTemplate,
        },
        {
          width: 100,
          sortable: false,
          resizeable: false,
          canAutoResize: false,
          checkboxable: false,
          cellTemplate: this.actionTemplate,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        }
      ];
    });
  }
  create() {
    this.mode = ShowMode.Create;
  }

  onDelete(item: any) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['NewsPaper.Link'], `${item.Hint}`))) {
      showLoading();
      this._newsPaperPostlService.delete(item).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }
  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }

  moveUp(index: number) {
    this.swap(index, index - 1);
  }

  moveDown(index: number) {
    this.swap(index, index + 1);
  }

  swap(from: number, to: number) {
    var temp = { ...this.rows[from] };
    this.rows[from] = this.rows[to];
    this.rows[to] = temp;
  }
  isUpdatingPosition: boolean = false;
  updatePosition() {
    if (!this.isUpdatingPosition) {
      this.isUpdatingPosition = true;
      this.payload.PageSize = Number.MAX_SAFE_INTEGER;
      this.payload.OrderBy = 'SequenceNumber asc';
      this.payload.Page = 0;
      this.payload.Search = '';
      this.loadData();
      return;
    }

    else {
      this._newsPaperPostlService.savePosition(this.rows).subscribe(d => {
        this.payload.PageSize = this.defaultPageSize;
        this.payload.OrderBy = this.defaultSort;
        this.loadData();
        this.isUpdatingPosition = false;
      })
    }
  }

}
