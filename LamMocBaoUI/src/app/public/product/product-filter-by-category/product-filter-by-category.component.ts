import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, SubCategory1, SubCategory2 } from '../../../../models/category';
import { CountProducts } from '../../../../models/product';
import { isMobile } from '../../../../services/extentions';
import { CategoryGroup, getCategoryGroupDescription, getCountProducts, getProductConfig, getProductFilterMenu, MenuByCategory, MenuByCategoryGroup, MenuByProductType, MenuHierarchy, ProductConfig, ProductTypeTag, setCountProducts, setProductConfig, setProductFilterMenu } from '../../../../services/external-data';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'product-filter-by-category',
  templateUrl: './product-filter-by-category.component.html',
  styleUrls: ['./product-filter-by-category.component.css']
})
export class ProductFilterByCategoryComponent implements OnInit {
  @Output() filterChange = new EventEmitter<ProductFilter>();
  @Input() currentFilter: ProductFilter = new ProductFilter();
  categoryRows: MenuByCategory[] = [];
  group!: CategoryGroup;
  menu!: MenuHierarchy;
  categoryGroup = CategoryGroup;
  getCategoryGroupDescription = getCategoryGroupDescription;
  productConfig!: ProductConfig;
  isMobile: boolean = isMobile();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
    }, this.resizeTimeout)
  }

  resizeTimeout = 100;
  resizeTimeoutId: any;
  countProducts: any = {};
  constructor(private _productService: ProductService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    var menu = getProductFilterMenu();
    if (!menu.IsSet) {
      this._productService.getMenu().subscribe(d => {
        var cookedMenu = this.doSetMenu(d)
        setProductFilterMenu(cookedMenu);
      });
    }
    else {
      this.menu = menu;
    }
    var config = getProductConfig();
    if (!config || !config.FilterProductPriceUpTo) {
      this._productService.getConfig().subscribe(d => {
        setProductConfig(d);
        this.applyProductConfig();
      });
    }
    else { this.applyProductConfig() };

    var countProducts = getCountProducts();
    if (countProducts && Object.keys(countProducts).length) {
      this.countProducts = countProducts;
    }
    else {
      this._productService.countProductByTypes().subscribe(d => {
        setCountProducts(d);
        this.countProducts = getCountProducts();
      })
    }
  }

  doSetMenu(menu: MenuHierarchy) {
    var keys = Object.keys(menu.MenuByCategories);
    var menuByCategories: MenuByCategoryGroup[] = [];
    keys.forEach(e => {
      var x = e as keyof typeof CategoryGroup;
      var category: CategoryGroup = CategoryGroup[x];
      menuByCategories.push(new MenuByCategoryGroup(category, menu.MenuByCategories[e]));
    });
    menu.MenuByCategories = menuByCategories;

    var values = Object.values(menu.MenuByCategories) as MenuByCategoryGroup[];
    this.categoryRows = [];
    values.forEach(d => {
      d.Categories.forEach(s => {
        this.categoryRows.push(s);
      })
    });
    this.menu = menu;
    return this.menu;
  }

  applyProductConfig() {
    this.productConfig = getProductConfig();
    this.currentFilter.PriceTo = this.productConfig.FilterProductPriceUpTo;
    this.submitFilter();
  }

  onChangePriceFrom(event: any) {
    if (!event.currentTarget.value || !this.currentFilter.PriceTo) {
      return;
    }

    if (1 * (event.currentTarget.value) > this.currentFilter.PriceTo) {
      return;
    }

    this.currentFilter.PriceFrom = 1 * event.currentTarget.value;
  }
  onChangePriceTo(event: any) {
    if (!event.currentTarget.value || !this.currentFilter.PriceFrom) {
      return;
    }

    if (1 * (event.currentTarget.value) < this.currentFilter.PriceFrom) {
      return;
    }

    this.currentFilter.PriceTo = 1 * event.currentTarget.value;
  }

  filterProductCategoryId(id: string) {
    if (this.currentFilter.CategoryId === id) {
      return;
    }

    this.resetFilter();
    this.currentFilter.CategoryId = id;
    this.submitFilter();
  }

  filterProductCategory(event: Category) {
    if (this.currentFilter.CategoryId === event.Id) {
      return;
    }
    this._router.navigateByUrl('/vat-pham/loai-san-pham/' + event.LinkName)
    this.resetFilter();
    this.currentFilter.CategoryId = event.Id;
  }

  filterProductCategory1(event: SubCategory1, e: any) {
    if (this.currentFilter.Sub1CategoryId === event.Id) {
      return;
    }
    this.resetFilter(['CategoryId']);

    var category = this.categoryRows.find(d => {
      if (!d.SubCategories || !d.SubCategories.length) {
        return false;
      }
      return d.SubCategories.findIndex(r => r.Id == event.Id) > -1;
    });
    this.currentFilter.CategoryId = category?.Id;
    this.currentFilter.Sub1CategoryId = event.Id;
    this.submitFilter();
    e.stopPropagation();
  }

  filterProductCategory2(event: SubCategory2, e: any) {
    if (this.currentFilter.Sub2CategoryId === event.Id) {
      return;
    }

    this.resetFilter(['CategoryId', 'Sub1CategoryId']);
    var category = this.categoryRows.find(d => {
      if (!d.SubCategories || !d.SubCategories.length) {
        return false;
      }
      return d.SubCategories.findIndex(r => r.SubCategories.findIndex(s => s.Id == event.Id) > -1) > -1;
    });
    if (category) {
      this.currentFilter.CategoryId = category.Id;
      this.currentFilter.Sub1CategoryId = category.SubCategories.find(d => {
        if (!d.SubCategories || !d.SubCategories.length) {
          return false;
        }
        return d.SubCategories.findIndex(s => s.Id == event.Id) > -1;
      })?.Id;
    }
    this.currentFilter.Sub2CategoryId = event.Id;
    this.submitFilter();
    e.stopPropagation();
  }

  filterByGroup(event: CategoryGroup) {
    if (this.currentFilter.Group === event) {
      return;
    }

    var linkName = CategoryGroup[event]
      .replace(/[A-Z]/g, (x: string) => {
        return `-${x.toLowerCase()}`
      }).slice(1);
    this._router.navigateByUrl('/vat-pham/nhom/' + linkName)
    this.resetFilter();
    this.currentFilter.Group = event;
  }

  filterByProductType(event: MenuByProductType) {
    if (this.currentFilter.ProductTypeId === event.Id) {
      return;
    }

    this._router.navigateByUrl('/vat-pham/ngu-hanh/' + event.LinkName)
    //this.resetFilter();
    //this.currentFilter.ProductTypeId = event.Id;
   
  }

  filterProductTypeTag(event: ProductTypeTag) {
    if (this.currentFilter.ProductTypeTagId === event.Id) {
      return;
    }
    this.resetFilter(['ProductTypeId']);
    this.currentFilter.ProductTypeTagId = event.Id;
    this.submitFilter();
  }

  submitFilter() {
    this.filterChange.emit(this.currentFilter);
  }

  resetFilter(excludeProperties: string[] | null = null) {
    if (!excludeProperties || excludeProperties.indexOf('Group') === -1) {
      this.currentFilter.Group = undefined;
    }
    if (!excludeProperties || excludeProperties.indexOf('ProductTypeId') === -1) {
      this.currentFilter.ProductTypeId = undefined;
    }
    
    if (!excludeProperties || excludeProperties.indexOf('ProductTypeTagId') === -1) {
      this.currentFilter.ProductTypeTagId = undefined;
    }
    
    if (!excludeProperties || excludeProperties.indexOf('CategoryId') === -1) {
      this.currentFilter.CategoryId = undefined;
    }
    
    if (!excludeProperties || excludeProperties.indexOf('Sub1CategoryId') === -1) {
      this.currentFilter.Sub1CategoryId = undefined;
    }
    if (!excludeProperties || excludeProperties.indexOf('Sub2CategoryId') === -1) {
      this.currentFilter.Sub2CategoryId = undefined;
    }
  }
}

export class ProductFilter {
  Group?: CategoryGroup;
  ProductTypeId?: string;
  ProductTypeTagId?: string;
  CategoryId?: string;
  Sub1CategoryId?: string;
  Sub2CategoryId?: string;
  PriceFrom?: number = 0;
  PriceTo?: number = 0;

  FetchSize: boolean = false;
  FetchTag: boolean = false;
  FetchMaterial: boolean = false;
  FetchImage: boolean = false;
  FetchProductType: boolean = false;
  FetchCategory: boolean = false;
}
