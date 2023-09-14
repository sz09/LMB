import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { Promotion, PromotionMode } from '../../../models/promotion-code';
import { format } from '../../../services/extentions';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { PromotionCodeService } from '../../../services/promotion-code.service';

@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html',
  styleUrls: ['./promotions-admin.component.css']
})
export class PromotionsAdminComponent {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: Promotion[] = [];
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'Code asc',
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'Promotion.Code',
    'Promotion.DiscountPercent',
    'Promotion.Mode',
    'Promotion.IsActive',
    'Label.Promotions',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  promotionMode = PromotionMode;
  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('discountPercentTemplate')
  discountPercentTemplate!: TemplateRef<any>;
  @ViewChild('modeTemplate')
  modeTemplate!: TemplateRef<any>;
  @ViewChild('isActiveTemplate')
  isActiveTemplate!: TemplateRef<any>;
  constructor(private _promotionService: PromotionCodeService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    setTimeout(() => this.loadColumn());
    this.loadData();
  }

  loadData() {
    showLoading();
    this._promotionService.searchAdmin(this.payload).subscribe(d => {
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
          prop: 'Code',
          name: this._translateTexts['Promotion.Code'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
        },
        {
          minWidth: 200,
          prop: 'Code',
          name: this._translateTexts['Promotion.DiscountPercent'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.discountPercentTemplate,
        },
        {
          minWidth: 200,
          name: this._translateTexts['Promotion.Mode'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.modeTemplate,
        },
        {
          prop:'IsActvice',
          minWidth: 50,
          name: this._translateTexts['Promotion.IsActive'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.isActiveTemplate,
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

  onDelete(item: Promotion) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Promotions'], `${item.Code}`))) {
      showLoading();
      this._promotionService.delete(item).subscribe(d => {
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
