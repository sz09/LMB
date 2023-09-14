import { formatNumber, getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubCategory1, SubCategory2 } from '../../../../models/category';
import { SelectListItem } from '../../../../models/common/SelectListItem';
import { LiteFile } from '../../../../models/lite-file';
import { ProductDetail, SizeViewModel } from '../../../../models/product';
import { UploadedImage } from '../../../../models/uploaded-image';
import { CategoryService } from '../../../../services/category.service';
import { appendNoneForDropdown } from '../../../../services/extentions';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { MaterialService } from '../../../../services/material.service';
import { ProductTypeService } from '../../../../services/product-type.service';
import { ProductService } from '../../../../services/product.service';
import { SizeService } from '../../../../services/size.service';
import { TagService } from '../../../../services/tags.service';

@Component({
  selector: 'product-admin-edit-admin',
  templateUrl: './product-admin-edit-admin.component.html',
  styleUrls: ['./product-admin-edit-admin.component.css']
})
export class ProductAdminEditAdminComponent {
  @Output()
  onClose = new EventEmitter<any>();
  isNew: boolean = false;
  numericNumberReg: string = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  currencySymbol = getCurrencySymbol('VND', 'narrow')
  product!: ProductDetail;
  @ViewChild('f')
  private form!: NgForm;
  images: LiteFile[] = [];
  constructor(
    private _productService: ProductService,
    private _productTypeService: ProductTypeService,
    private _categoryService: CategoryService,
    private _sizeService: SizeService,
    //private _materialService: MaterialService,
    private _tagService: TagService,
    private _translate: TranslateService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    var timeoutLoad: any;
    this._activatedRoute.params.subscribe(d => {
      if (timeoutLoad) {
        clearTimeout(timeoutLoad);
      }
      timeoutLoad = setTimeout(() => {
        var id = d['id'];
        if (id) {
          this.loadData(id);
        }
        else {
          this.product = new ProductDetail();
        }
        this.isNew = !id;
      }, 500);
    })

    this.loadCommonItems();
  }

  loadData(id: string) {
    this._productService.loadById(id).subscribe(d => {
      if (d) {
        this.product = d;
        this.product.AddImageIds = [];
        this.product.RemoveImageIds = [];
        if (!this.product.TagIds) {
          this.product.TagIds = [];
        }
        if (!this.product.MaterialIds) {
          this.product.MaterialIds = [];
        }
        if (!this.product.CategoryIds) {
          this.product.CategoryIds = [];
        }
        if (!this.product.Tags) {
          this.product.Tags = [];
        }
        if (!this.product.SupportedSizes) {
          this.product.SupportedSizes = [];
        }
        if (!this.product.ProductTypeId) {
          this.product.ProductTypeId = '';
        }
        this.doShowTags();
        //this.doShowMaterials();
        this.doShowCategories();
        this.doShowSizes();
        this.images = this.product.Images.map(d => {
          var liteImage = new LiteFile();
          liteImage.Id = d.Id;
          liteImage.Url = d.Url;
          return liteImage;
        });
      }
    });
  }

  doShowTags() {
    if (this.product && this.product.TagIds && this.product.TagIds.length
      && (!this.selectedTags || this.selectedTags.length === 0)
      && (this.tags && this.tags.length)) {
      this.selectedTags = this.tags.filter(d => this.product.TagIds.indexOf(d.Id) > -1);
    }
  }
  //doShowMaterials() {
  //  if (this.product && this.product.MaterialIds && this.product.MaterialIds.length
  //    && (!this.selectedMaterials || this.selectedMaterials.length === 0)
  //    && (this.materials && this.materials.length)) {
  //    this.selectedMaterials = this.materials.filter(d => this.product.MaterialIds.indexOf(d.Id) > -1);
  //  }
  //}

  doShowCategories() {
    if ((this.product && this.product.Categories && this.product.Categories.length) &&
      (this.categories && this.categories.length)) {
      var currentCategories = this.product.Categories as any[];
      this.categories.forEach(category => {
        var idx = currentCategories.findIndex(d => d.Id == category.Id);
        if (idx > -1) {
          var cat = { ...category };
          var currentCategory = currentCategories[idx];
          if (cat.ExtraInfos && cat.ExtraInfos.length) {
            currentCategory.SubCategories.forEach((sub1: any) => {
              var catSub1 = cat.ExtraInfos.find((e: any) => e.Id === sub1.Id);
              if (catSub1) {
                Object.assign(catSub1, { IsChecked: sub1.IsChecked });
                if (sub1.SubCategories && sub1.SubCategories.length) {
                  sub1.SubCategories.forEach((sub2: any) => {
                    var catSub2 = catSub1.SubCategories.find((e: any) => e.Id === sub2.Id);
                    if (catSub2) {
                      Object.assign(catSub2, { IsChecked: sub2.IsChecked });
                    }
                  })
                }
              }
            })
            for (var i = 0; i < cat.ExtraInfos.length; i++) {
              cat.ExtraInfos[i] = new SubCategory1(cat.ExtraInfos[i]) 
            }
          }
          
          this.selectedCategories.push(cat);
        }
      })
    }
  }

  doShowSizes() {
    if (this.product && this.product.SupportedSizes && this.product.SupportedSizes.length
      && (this.sizes && this.sizes.length)) {
      this.product.SupportedSizes.forEach(d => {
        d.Label = this.sizes.find(e => e.Id == d.SizeId)?.Label ?? '';
      })
    }
  }

  selectedCategories: SelectListItem[] = [];
  selectedMaterials: SelectListItem[] = [];
  selectedTags: SelectListItem[] = [];
  productTypes: SelectListItem[] = [];
  categories: SelectListItem[] = [];
  sizes: SelectListItem[] = [];
  tags: SelectListItem[] = [];
  //materials: SelectListItem[] = [];
  loadCommonItems() {
    this._productTypeService.getListDropdown().subscribe(d => {
      appendNoneForDropdown(d, this._translate).subscribe(d => this.productTypes = d);
    })
    this._categoryService.getListDropdown().subscribe(d => {
      appendNoneForDropdown(d, this._translate).subscribe(d => {
        this.categories = d;
        this.doShowCategories();
      });
    })
    this._sizeService.getListDropdown().subscribe(d => {
      appendNoneForDropdown(d, this._translate).subscribe(d => {
        this.sizes = d;
        this.doShowSizes();
      });
    })
    this._tagService.getListDropdown().subscribe(d => {
      appendNoneForDropdown(d, this._translate).subscribe(d => {
        this.tags = d
        this.doShowTags();
      });
    })
    //this._materialService.getListDropdown().subscribe(d => {
    //  appendNoneForDropdown(d, this._translate).subscribe(d => {
    //    this.materials = d;
    //    this.doShowMaterials();
    //  });
    //})
  }
  trackingAddCategories: string[] = [];
  trackingRemoveCategories: string[] = [];
  fakeCategoryId: string = '';
  addCategory(item: SelectListItem) {
    if (!item.Id || this.product.CategoryIds.indexOf(item.Id) > -1) {
      return;
    }

    this.product.CategoryIds.push(item.Id);
    this.selectedCategories.push(item);
    setTimeout(() => {
      this.fakeCategoryId = '';
    })
    if (this.trackingRemoveCategories.indexOf(item.Id) > -1) {
      this.trackingRemoveCategories = this.trackingRemoveCategories.filter(d => d != item.Id);
    }
    else {
      this.trackingAddCategories.push(item.Id);
    }
  }
  removeCategory(item: SelectListItem) {
    this.product.CategoryIds = this.product.CategoryIds.filter(d => d !== item.Id);
    this.selectedCategories = this.selectedCategories.filter(d => d.Id != item.Id);
    if (this.trackingAddCategories.indexOf(item.Id) > -1) {
      this.trackingAddCategories = this.trackingAddCategories.filter(d => d != item.Id);
    }
    else {
      this.trackingRemoveCategories.push(item.Id);
    }
  }

  fakeSizeId: string = '';
  addSize(item: SelectListItem) {
    if (!item.Id || this.product.SupportedSizes.findIndex(d => d.SizeId == item.Id) > -1) {
      return;
    }

    var supportedSize = new SizeViewModel();
    supportedSize.SizeId = item.Id;
    supportedSize.Label = item.Label;
    this.product.SupportedSizes.push(supportedSize);
    setTimeout(() => {
      this.fakeSizeId = '';
    })
  }
  removeSize(id: string) {
    this.product.SupportedSizes = this.product.SupportedSizes.filter(d => d.SizeId !== id);
  }

  fakeTagId: string = '';
  addTag(item: SelectListItem) {
    if (!item.Id || this.product.TagIds.indexOf(item.Id) > -1) {
      return;
    }

    this.product.TagIds.push(item.Id);
    this.selectedTags.push(item);
    setTimeout(() => {
      this.fakeTagId = '';
    })
  }
  removeTag(item: SelectListItem) {
    this.product.TagIds = this.product.TagIds.filter(d => d !== item.Id);
    this.selectedTags = this.selectedTags.filter(d => d.Id !== item.Id);
  }

  fakeMaterialId: string = '';
  addMaterial(item: SelectListItem) {
    if (!item.Id || this.product.MaterialIds.indexOf(item.Id) > -1) {
      return;
    }

    this.product.MaterialIds.push(item.Id);
    this.selectedMaterials.push(item);
    setTimeout(() => {
      this.fakeCategoryId = '';
    })
  }
  removeMaterial(item: SelectListItem) {
    this.product.MaterialIds = this.product.MaterialIds.filter(d => d !== item.Id);
    this.selectedMaterials = this.selectedMaterials.filter(d => d.Id !== item.Id);
  }

  removeImage(item: UploadedImage) {
    this.product.Images = this.product.Images.filter(d => d.Id !== item.Id);
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    var prepareData = this.selectedCategories.map(a => {
      var subCategories = a.ExtraInfos.map((d: { Id: any, SubCategories: never[]; IsAdded: any; IsRemoved: any; IsChecked: any; }) => {
        var subCategorie1s = d.SubCategories ?? [];
        return {
          Id: d.Id,
          IsAdded: d.IsAdded,
          IsRemoved: d.IsRemoved,
          IsChecked: d.IsChecked,
          ParentId: a.Id,
          SubCategories: subCategorie1s.map((e: { SubCategory1Id: any; IsAdded: any; IsRemoved: any; IsChecked: any; Id: any; SubCategories: any[] }) => {
            return {
              Id: e.Id,
              SubCategory1Id: e.Id,
              IsAdded: e.IsAdded,
              IsRemoved: e.IsRemoved,
              IsChecked: e.IsChecked,
              ParentId: d.Id
            }
          })
        }
      });
      return {
        Id: a.Id,
        CategoryId: a.Id,
        IsAdded: this.trackingAddCategories.indexOf(a.Id) > -1,
        IsRemoved: this.trackingRemoveCategories.indexOf(a.Id) > -1,
        SubCategories: subCategories
      }
    });
    this.product.Categories = prepareData;
    var cloneProduct = this.copy();
    if (!cloneProduct.ProductTypeId) {
      cloneProduct.ProductTypeId = null;
    }
    if (!cloneProduct.CategoryId) {
      cloneProduct.CategoryId = null;
    }
    if (this.isNew) {
      this._productService.create(cloneProduct).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl(`admin/san-pham/${d}`);
      });
    }
    else {
      this._productService.update(cloneProduct).subscribe(d => {
        hideLoading();
      });
    }
  }

  copy() {
    var productDetail = new ProductDetail();
    Object.assign(productDetail, this.product);
    return productDetail;
  }

  onToggleSub1(item: SelectListItem, sub1: SubCategory1) {
    if (!sub1.checked) {
      sub1.SubCategories.forEach(d => {
        d.checked = false;
      })
    }
  }
  onToggleSub2(item: SelectListItem, sub1: SubCategory1, sub2: SubCategory2) {
    if (sub2.checked) {
      if (!sub1.checked) {
        sub1.checked = false;
      }
    }
  }

  numberFormat(value: any) {
    if (isNaN(value)) {
      return;
    }

    value = formatNumber(value, 'vi-VN')
  }
  onUploaded(file: LiteFile) {
    this.product.AddImageIds.push(file.Id);
  }
  onRemove(id: string) {
    this.product.Images = this.product.Images.filter(d => d.Id != id);
    this.product.AddImageIds = this.product.AddImageIds.filter(d => d != id);
    this.product.RemoveImageIds.push(id);
  }
  toNumber(value: any) {
  }
  markAllControlDirty() {
    var keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
    })
  }
  backToGrid() {
    this.onClose.emit();
    this._router.navigateByUrl('admin/san-pham');
  }
}
