import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { Product } from '../../../models/product';
import { format } from '../../../services/extentions';
import { HighlightEntityType, HighlightItemService } from '../../../services/highlight-Item.service';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { ProductService } from '../../../services/product.service';
import { EntityType } from '../admin-navigation/admin-navigation.component';

@Component({
  selector: 'product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: Product[] = [];
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
    'Product.Name',
    'Product.PurchasingPrice',
    'Product.SellingPrice',
    'Product.EmptyData',
    'FiveElement.Title',
    'Common.Images',
    'Label.Products',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  highlightEntityIds: any = {};

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('priceTemplate')
  priceTemplate!: TemplateRef<any>;
  @ViewChild('imagesTemplate')
  imagesTemplate!: TemplateRef<any>;
  constructor(private _productService: ProductService,
    private _router: Router,
    private _highlightItemService: HighlightItemService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    if (this._router.url.endsWith('admin')) {
      this._router.navigateByUrl('/admin/san-pham');
    }
    setTimeout(() => this.loadColumn());
    this.loadData();
  }
  loadData() {
    showLoading();
    this._productService.searchAdmin(this.payload).subscribe(d => {
      this.rows = d.Data;
      this.totalRows = d.Total;
      this.total = this.rows.length;
      this._highlightItemService.highlightItems(d.Data.map(d => d.Id), HighlightEntityType.Products).subscribe(d => {
        this.highlightEntityIds = {};
        d.forEach(e => {
          this.highlightEntityIds[e] = true;
        })
      });
      hideLoading();
    })
  }

  loadColumn() {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
      this.gridMessage.emptyMessage = this._translateTexts['Product.EmptyData'];
      this.columns = [
        {
          minWidth: 200,
          prop: 'Name',
          name: this._translateTexts['Product.Name'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
        },
        {
          minWidth: 100,
          prop: 'PurchasingPrice',
          name: this._translateTexts['Product.PurchasingPrice'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.priceTemplate
        },
        {
          minWidth: 100,
          prop: 'SellingPrice',
          name: this._translateTexts['Product.SellingPrice'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.priceTemplate
        },
        {
          minWidth: 200,
          name: this._translateTexts['Common.Images'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.imagesTemplate
        },
        {
          prop: 'ProductTypeName',
          minWidth: 70,
          name: this._translateTexts['FiveElement.Title'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        },
        {
          width: 140,
          sortable: false,
          reproductable: false,
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

  onDelete(item: Product) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Products'], item.Name))) {
      showLoading();
      this._productService.delete(item).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }

  highlightItem(item: Product) {
    showLoading();
    this._highlightItemService.doHighlightItem(item.Id, HighlightEntityType.Products).subscribe(d => {
      hideLoading();
      this.highlightEntityIds[item.Id] = d.Data;
    })
  }
  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }
}
