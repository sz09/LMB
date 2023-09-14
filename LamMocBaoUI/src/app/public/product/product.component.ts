import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { MessageService } from '../../../events/message.service';
import { MessageType } from '../../../events/messages/message-type';
import { CategoryGroup, LiteMaterial } from '../../../models/category';
import { ResultView } from '../../../models/common/result-view';
import { SelectListItem } from '../../../models/common/SelectListItem';
import { Product, ProductOrder } from '../../../models/product';
import { ProductType } from '../../../models/product-type';
import { CategoryService } from '../../../services/category.service';
import { batch, useBatchSizeByScreen } from '../../../services/extentions';
import { getProductDropdownCategories, getProductDropdownLiteMaterials, getProductDropdownProductTypes, MetaKeyValue, MetaKeyWords, setProductDropdownCategories, setProductDropdownLiteMaterials, setProductDropdownProductTypes } from '../../../services/external-data';
import { HomeService } from '../../../services/home-page.service';
import { ProductService } from '../../../services/product.service';
import { AppComponent } from '../../app.component';
import { ProductFilter } from './product-filter-by-category/product-filter-by-category.component';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  currentSort: any;
  products: Product[] = [];
  productRows: Product[][] = [];
  total: number = 0;
  payload: {
    Search: string,
    Filter: ProductFilter,
    OrderBy: ProductOrder,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } =
    {
      Search: '',
      Filter: new ProductFilter(),
      OrderBy: ProductOrder.MoiNhat,
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };
  readonly DISPLAY_ITEMS_ROW_PC: number = 4;
  readonly DISPLAY_ITEMS_ROW_MOBILE: number = 4;

  filterItems: {
    Value: string,
    Title: string
  }[] = [];
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.updateBatchViewItems();
    }, this.resizeTimeout)
  }

  timeOutScroll: any;
  resizeTimeout = 100;
  resizeTimeoutId: any;
  filterByType: FilterByType = FilterByType.None;
  filterByValue: any;
  filterByText: any;
  lockSearchProduct: boolean = false;
  translateValues: any = {};
  constructor(private _titleService: Title,
    private _translate: TranslateService,
    private _productService: ProductService,
    private _messageService: MessageService,
    private _categoryService: CategoryService,
    private _activatedRoute: ActivatedRoute,
    private _homeService: HomeService,
    private meta: Meta,
    @Inject(AppComponent) private parent: AppComponent) {
    this.prepareData();

    this._translate.get(['Title.Products']).subscribe(d => {
      this.translateValues = d;
      this._titleService.setTitle(this.translateValues['Title.Products']);
      if (!this.filterByType) {
        this.meta.addTag({ name: MetaKeyWords.keywords, content: this.translateValues['Title.Products'], charset: MetaKeyValue.charset });
      }
    });
    this.meta.addTag({ name: MetaKeyWords.description, content: 'Vật phẩm của Lâmm Môc Bảo', charset: MetaKeyValue.charset });
  }
  categories: SelectListItem[] = []
  doRouteByUrlFilterTimeout: any;
  doRouteByUrlFilter(func: any) {
    if (this.isPrepared()) {
      clearTimeout(this.doRouteByUrlFilterTimeout);
      func && func();
    }
    else {
      this.doRouteByUrlFilterTimeout = setTimeout(() => {
        this.doRouteByUrlFilter(func);
      });
    }
  }

  isPrepared() {
    switch (this.filterByType) {
      case FilterByType.Material:
        return this.liteMaterials && this.liteMaterials.length;
      case FilterByType.Group:
        return true;
      case FilterByType.FiveElem:
        return this.productTypes && this.productTypes.length;
      case FilterByType.Category:
        return this.categories && this.categories.length;
    }
    return false;
  }
  ngOnDestroy(): void {
    this._messageService.unreigister(MessageType.SearchProduct);
    this._messageService.unreigister(MessageType.Navigated);
    this._messageService.unreigister(MessageType.OneTime);
    if (this.timeOutScroll) {
      clearTimeout(this.timeOutScroll);
    }
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(d => {
      if (d.keys.length) {
        var key1 = d.keys[0] as any;
        var enumValue = FilterByType[key1] as any;
        if (enumValue) {
          this.filterByType = enumValue;
          this.filterByValue = d.get(key1);
          this.lockSearchProduct = true;
          this.doRouteByUrlFilter(() => {
            this.lockSearchProduct = true;
            this.filterByHomeLink();
          })
        }
      }
    })
    this._translate.get([
      'Product.Sort.Newest',
      'Product.Sort.Bestseller',
      'Product.Sort.PriceFromLowToHigh',
      'Product.Sort.PriceFromHighToLow'
    ]).subscribe(d => {
      this.filterItems = [
        { Value: ProductOrder.MoiNhat, Title: d['Product.Sort.Newest'] },
        { Value: ProductOrder.BanChay, Title: d['Product.Sort.Bestseller'] },
        { Value: ProductOrder.GiaThapToiCao, Title: d['Product.Sort.PriceFromLowToHigh'] },
        { Value: ProductOrder.GiaCaoToiThap, Title: d['Product.Sort.PriceFromHighToLow'] }
      ];
    })

    this.initSearchTerm();
    this._messageService.reigister(MessageType.SearchProduct, (searchTerm: string) => {
      this.payload.Search = searchTerm;
      this.payload.Page = 0;
      this.onSearchProduct();
    });

    this._messageService.reigister(MessageType.OneTime, (d: any) => {
      var filter = Object.assign(d, this.payload.Filter);
      this.onFilterChange(filter);
    });
    this.timeOutScroll = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }, 100)

  }

  prepareData() {
    this.categories = getProductDropdownCategories();
    if (!this.categories || !this.categories.length) {
      this._categoryService
        .getPublicListDropdown()
        .subscribe(d => {
          setProductDropdownCategories(d);
          this.categories = getProductDropdownCategories();
        });
    }

    this.productTypes = getProductDropdownProductTypes();
    if (!this.productTypes || !this.productTypes.length) {
      this._homeService
        .getHomePageConfig()
        .subscribe(d => {
          setProductDropdownProductTypes(d.ProductTypes);
          this.productTypes = getProductDropdownProductTypes();
        });
    }

    this.liteMaterials = getProductDropdownLiteMaterials();
    if (!this.liteMaterials || !this.liteMaterials.length) {
      this._categoryService.getByMaterials().subscribe(d => {
        setProductDropdownLiteMaterials(d);
        this.liteMaterials = getProductDropdownLiteMaterials();
      });
    }
  }

  filterByHomeLink() {
    switch (this.filterByType) {
      case FilterByType.Material:
        this.filterByMaterial();
        break;
      case FilterByType.Group:
        this.filterByGroup();
        break;
      case FilterByType.FiveElem:
        this.filterByFiveElem();
        break;
      case FilterByType.Category:
        this.filterByCategory();
        break;
    }
  }
  liteMaterials: LiteMaterial[] = [];
  filterByMaterial() {
    var filter = {};
    if (this.filterByValue) {
      if (this.liteMaterials && this.liteMaterials.length) {
        this.doSetTagAndTitleByLiteMaterials(this.liteMaterials);
      }
      else {
        this._categoryService.getByMaterials().subscribe(d => {
          this.doSetTagAndTitleByLiteMaterials(d)
        });
      }
    }
    else {
      this.lockSearchProduct = false;
      this.onFilterChange(filter);
    }
  }
  doSetTagAndTitleByLiteMaterials(liteMaterials: LiteMaterial[]) {
    var filter = {};
    var idx = liteMaterials.findIndex(e => e.LinkName === this.filterByValue)
    if (idx > -1) {
      var category = liteMaterials[idx];
      filter = { CategoryId: category.Id };
      this.meta.addTag({ name: MetaKeyWords.keywords, content: category.Name, charset: MetaKeyValue.charset });
      this.meta.addTag({ name: MetaKeyWords.keywords, content: category.LinkName, charset: MetaKeyValue.charset });
      this.filterByText = category.Name;
      this._titleService.setTitle(`${this.translateValues['Title.Products']} - ${category.Name}`);
    }
    else {
      this.setDefaultMetaTag();
    }
    this.lockSearchProduct = false;
    this.onFilterChange(filter);
  }

  filterByGroup() {
    var filter = {};
    if (this.filterByValue) {
      var key = this.filterByValue
        .replace(/-(.)/g, (x: string) => {
          return x.replace('-', '').toUpperCase()
        })
      key = key.charAt(0).toUpperCase() + key.slice(1);
      var categoryGroup = CategoryGroup[key]
      if (!isNullOrUndefined(categoryGroup)) {
        filter = { Group: categoryGroup }
      }
      this.filterByText = this.filterByValue
        .replace(/-(.)/g, (x: string) => {
          return x.replace('-', ' ').toUpperCase()
        })
    }

    this.lockSearchProduct = false;
    this.onFilterChange(filter);
  }
  productTypes: ProductType[] = [];
  filterByFiveElem() {
    var filter = {};
    if (this.filterByValue) {
      if (this.productTypes && this.productTypes.length) {
        this.doSetTagAndTitleByProductTypes(this.productTypes);
      }
      else {
        this._homeService
          .getHomePageConfig()
          .subscribe(d => {
            this.doSetTagAndTitleByProductTypes(d.ProductTypes);
          });
      }
    }
    else {
      this.lockSearchProduct = false;
      this.onFilterChange(filter);
    }
  }
  doSetTagAndTitleByProductTypes(productTypes: ProductType[]) {
    var filter = {};
    var idx = productTypes.findIndex(e => e.LinkName === this.filterByValue)
    if (idx > -1) {
      var productType = productTypes[idx];
      filter = { ProductTypeId: productType.Id };
      this.meta.addTag({ name: MetaKeyWords.keywords, content: productType.Name, charset: MetaKeyValue.charset });
      this.meta.addTag({ name: MetaKeyWords.keywords, content: productType.LinkName, charset: MetaKeyValue.charset });
      this._titleService.setTitle(`${this.translateValues['Title.Products']} - ${productType.Name}`);
    }
    else {
      this.setDefaultMetaTag();
    }
    this.lockSearchProduct = false;
    this.onFilterChange(filter);
  }

  filterByCategory() {
    var filter = {};
    if (this.filterByValue) {
      if (this.categories && this.categories.length) {
        this.doSetTagAndTitleByCategory(this.categories);
      }
      else {
        this._categoryService
          .getPublicListDropdown()
          .subscribe(d => {
            this.doSetTagAndTitleByCategory(d);
          });
      }
    }
    else {
      this.lockSearchProduct = false;
      this.onFilterChange(filter);
    }
  }
  doSetTagAndTitleByCategory(comboValues: SelectListItem[]) {
    var filter = {};
    var idx = comboValues.findIndex(e => e.ExtraInfos === this.filterByValue)
    if (idx > -1) {
      var category = comboValues[idx];
      filter = { CategoryId: category.Id };
      this.meta.addTag({ name: MetaKeyWords.keywords, content: category.Label, charset: MetaKeyValue.charset });
      this.meta.addTag({ name: MetaKeyWords.keywords, content: category.ExtraInfos, charset: MetaKeyValue.charset });
      this._titleService.setTitle(`${this.translateValues['Title.Products']} - ${category.Label}`);
      this.filterByText = category.Label;
    }
    else {
      this.setDefaultMetaTag();
    }
    this.lockSearchProduct = false;
    this.onFilterChange(filter);
  }

  setDefaultMetaTag() {
    this.meta.addTag({ name: MetaKeyWords.keywords, content: this.translateValues['Title.Products'], charset: MetaKeyValue.charset });
  }


  getProductLink(linkName: string) {
    return `san-pham/${linkName}`;
  }

  initSearchTerm() {
    this.payload.Search = this.parent.searchTerm;
  }
  _delay = 0;
  _timeout: any;
  onSearchProduct() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      if (this.lockSearchProduct) {
        return;
      }

      this.payload.Filter.FetchImage = true;
      this.payload.Filter.FetchMaterial = true;
      this._productService.search(this.payload).subscribe(d => {
        this.buildData(d);
      });
    }, this._delay);
  }

  buildData(result: ResultView<Product>) {
    this.products = result.Data;
    this.total = result.Total;
    this.updateBatchViewItems();
  }
  updateBatchViewItems() {
    this.productRows = batch(this.products, useBatchSizeByScreen(this.DISPLAY_ITEMS_ROW_PC, this.DISPLAY_ITEMS_ROW_MOBILE));
  }
  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.onSearchProduct();
  }

  onFilterChange(filter: any) {
    this.payload.Filter = filter;
    this.onSearchProduct();
  }
}

export enum FilterByType {
  None,
  Material,
  Group,
  FiveElem,
  Category
}
