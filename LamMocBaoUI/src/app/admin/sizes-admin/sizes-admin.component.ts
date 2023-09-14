import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Size } from '../../../models/size';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SizeService } from '../../../services/size.service';
import { ShowMode } from '../../../models/common/show-mode';
import { format } from '../../../services/extentions';


@Component({
  selector: 'app-sizes-admin',
  templateUrl: './sizes-admin.component.html',
  styleUrls: ['./sizes-admin.component.css']
})
export class SizesAdminComponent implements OnInit {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: Size[] = [];
  payload: {
    Search: string, 
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'Number asc',
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'Size.Name',
    'Label.Sizes',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  bsEditorModalRef!: BsModalRef;

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate')
  nameTemplate!: TemplateRef<any>;
  constructor(private _sizeService: SizeService,
    private _modalService: BsModalService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    setTimeout(() => this.loadColumn());
    this.loadData();
  }

  loadData() {
    showLoading();
    this._sizeService.searchAdmin(this.payload).subscribe(d => {
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
      this.columns = [
        {
          minWidth: 200,
          name: this._translateTexts['Size.Name'],
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

  onDelete(item: Size) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Sizes'], `${item.Number} ${item.Unit}`))) {
      showLoading();
      this._sizeService.delete(item).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }
  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }
}
