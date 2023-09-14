import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../../../models/category';
import { ShowMode } from '../../../models/common/show-mode';
import { Material } from '../../../models/material';
import { format } from '../../../services/extentions';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { MaterialService } from '../../../services/material.service';

@Component({
  selector: 'app-materials-admin',
  templateUrl: './materials-admin.component.html',
  styleUrls: ['./materials-admin.component.css']
})
export class MaterialsAdminComponent {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: Material[] = [];
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
    'Material.Name',
    'Label.Materials',
    'Material.EmptyData',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
/*  bsEditorModalRef!: BsModalRef;*/

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate')
  nameTemplate!: TemplateRef<any>;
  constructor(
    private _materialService: MaterialService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.loadColumn());
  }

  loadData() {
    showLoading();
    this._materialService.searchAdmin(this.payload).subscribe(d => {
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
      this.gridMessage.emptyMessage = this._translateTexts['Material.EmptyData'];
      this.columns = [
        {
          minWidth: 200,
          name: this._translateTexts['Label.Materials'],
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

  onDelete(item: any) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Materials'], `${item.Name}`))) {
      showLoading();
      this._materialService.delete(item).subscribe(d => {
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
