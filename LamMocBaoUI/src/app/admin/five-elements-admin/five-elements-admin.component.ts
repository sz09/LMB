import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { ProductType } from '../../../models/product-type';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { ProductTypeService } from '../../../services/product-type.service';

@Component({
  selector: 'app-five-elements-admin',
  templateUrl: './five-elements-admin.component.html',
  styleUrls: ['./five-elements-admin.component.css']
})
export class FiveElementsAdminComponent {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: ProductType[] = [];
  readonly defaultPageSize: number = 10;
  readonly defaultSort: string = 'Name asc';
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'Name asc',
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'ProductType.Name',
    'ProductType.EmptyData',
    'Common.AreYouSureToDeleteItem'
  ];
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  _translateTexts: any = {};
  /*  bsEditorModalRef!: BsModalRef;*/

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate')
  nameTemplate!: TemplateRef<any>;
  constructor(
    private _productTypeService: ProductTypeService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.loadColumn());
  }

  loadData() {
    showLoading();
    this._productTypeService.searchAdmin(this.payload).subscribe(d => {
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
      this.gridMessage.emptyMessage = this._translateTexts['ProductType.EmptyData'];
      this.columns = [
        {
          minWidth: 200,
          name: this._translateTexts['ProductType.Name'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.nameTemplate,
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

  //onDelete(item: any) {
  //  if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Tag.Name'], `${item.Name}`))) {
  //    showLoading();
  //    this._tagService.delete(item).subscribe(d => {
  //      this.loadData();
  //      hideLoading();
  //    })
  //  }
  //}
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
      this._productTypeService.savePosition(this.rows).subscribe(d => {
        this.payload.PageSize = this.defaultPageSize;
        this.payload.OrderBy = this.defaultSort;
        this.loadData();
        this.isUpdatingPosition = false;
      })
    }
  }

}
