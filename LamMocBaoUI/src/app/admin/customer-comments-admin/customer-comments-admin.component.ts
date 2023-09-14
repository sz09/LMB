import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { CustomerComment } from '../../../models/customer-comment';
import { LiteFile } from '../../../models/lite-file';
import { CustomerCommentsService } from '../../../services/customer-comments.service';
import { format } from '../../../services/extentions';
import { hideLoading, showLoading } from '../../../services/loader.service';

@Component({
  selector: 'app-customer-comments-admin',
  templateUrl: './customer-comments-admin.component.html',
  styleUrls: ['./customer-comments-admin.component.css']
})
export class CustomerCommentsAdminComponent {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: CustomerComment[] = [];
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
    'CustomerComment.Hint',
    'CustomerComment.UploadedImage',
    'CustomerComment.EmptyData',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  /*  bsEditorModalRef!: BsModalRef;*/

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('imagesTemplate')
  imagesTemplate!: TemplateRef<any>;
  @ViewChild('hintTemplate')
  hintTemplate!: TemplateRef<any>;
  constructor(
    private _customCommentsService: CustomerCommentsService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.loadColumn());
  }

  loadData() {
    showLoading();
    this._customCommentsService.searchAdmin(this.payload).subscribe(d => {
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
      this.gridMessage.emptyMessage = this._translateTexts['CustomerComment.EmptyData'];
      this.columns = [
        {
          minWidth: 100,
          name: this._translateTexts['CustomerComment.Hint'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.hintTemplate,
        },
        {
          minWidth: 200,
          name: this._translateTexts['CustomerComment.UploadedImage'],
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
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['CustomerComment.Hint'], `${item.Hint}`))) {
      showLoading();
      this._customCommentsService.delete(item).subscribe(d => {
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
      this._customCommentsService.savePosition(this.rows).subscribe(d => {
        this.payload.PageSize = this.defaultPageSize;
        this.payload.OrderBy = this.defaultSort;
        this.loadData();
        this.isUpdatingPosition = false;
      })
    }
  }
}
