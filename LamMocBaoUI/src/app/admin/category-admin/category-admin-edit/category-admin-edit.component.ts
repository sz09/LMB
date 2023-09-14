import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Category, CategoryGroup, SubCategory1, SubCategory2 } from '../../../../models/category';
import { LiteFile } from '../../../../models/lite-file';
import { CategoryService } from '../../../../services/category.service';
import { FileService } from '../../../../services/file.service';
import { hideLoading, showLoading } from '../../../../services/loader.service';

@Component({
  selector: 'category-admin-edit',
  templateUrl: './category-admin-edit.component.html',
  styleUrls: ['./category-admin-edit.component.css']
})
export class CategoryAdminEditComponent implements OnInit {
  isNew: boolean = false;
  isChangeImage: boolean = false;
  category!: Category;
  @ViewChild('f')
  private form!: NgForm;
  @Output()
  onClose = new EventEmitter<any>();
  groups: { Id: CategoryGroup, Label?: string }[] = [
    { Id: CategoryGroup.VatPhamTheoChatLieu },
    { Id: CategoryGroup.VatPhamSuuTam },
    { Id: CategoryGroup.Nhan },
    //{ Id: CategoryGroup.TreoXe },
    //{ Id: CategoryGroup.CharmVang24K },
    //{ Id: CategoryGroup.LinhThu },
    //{ Id: CategoryGroup.VongCo },
    //{ Id: CategoryGroup.XongTram },
  ]
  constructor(
    private _categroryService: CategoryService,
    private _router: Router,
    private _fileService: FileService,
    private _translate: TranslateService,
    private _activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    var prefix = "Category.";
    var keys = this.groups.map(d => `${prefix}${CategoryGroup[d.Id].toString()}`);
    this._translate.get(keys).subscribe(translated => {
      Object.keys(translated).forEach(key => {
        var stringKey = key.replace(prefix, '') as any;
        var categoryGroupKey = CategoryGroup[stringKey];
        var intKey = categoryGroupKey as any;
        var groupIndex = this.groups.findIndex(d => d.Id == intKey);
        if (groupIndex > -1) {
          this.groups[groupIndex].Label = translated[key]
        }
      });
    })
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this.loadDetail(id);
      }
      else {
        this.category = new Category();
      }
      this.isNew = !id;
    })
  }

  loadDetail(id: string) {
    showLoading();
    this._categroryService.loadById(id).subscribe(d => {
      if (d.Data) {
        this.category = d.Data;
        this.doOrderFromServerSide();
        hideLoading();
      }
    });
  }

  displayInputSub1: any = {};
  displayInputSub2: any = {};
  addSubCategory1() {
    if (!this.category.SubCategories) {
      this.category.SubCategories = [];
    }

    var sub = new SubCategory1(null);
    sub.Name = `Sub-${this.category.SubCategories.length + 1}`;
    sub.TempId = `Sub1-${new Date().getTime()}`;
    this.category.SubCategories.push(sub);
  }
  removeSub1(sub1: SubCategory1) {
    this.category.SubCategories = this.category.SubCategories.filter(d => d.TempId !== sub1.TempId);
  }

  addSubCategory2(sub1: SubCategory1) {
    if (!sub1.SubCategories) {
      sub1.SubCategories = [];
    }

    var sub = new SubCategory2(null);
    sub.Name = `Sub-${sub1.SubCategories.length + 1}`;
    sub.TempId = `Sub1-${new Date().getTime()}`;
    sub1.SubCategories.push(sub);
  }
  removeSub2(sub1Index: number, sub1: SubCategory1, sub2: SubCategory2) {
    sub1.SubCategories = sub1.SubCategories.filter(d => d.TempId !== sub2.TempId);
    this.category.SubCategories[sub1Index] = sub1;
  }
  saveCategory() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    this.updateSequenceNumber();
    showLoading();
    if (this.isNew) {
      this._categroryService.createCategory(this.category).subscribe(d => {
        this._router.navigateByUrl(`/admin/loai-san-pham/${d}`);
        hideLoading();
      });
    }
    else {
      this._categroryService.updateCategory(this.category).subscribe(d => {
        this.loadDetail(this.category.Id);
        hideLoading();
      });
    }
  }

  doOrderFromServerSide() {
    if (this.category.SubCategories) {
      this.category.SubCategories = this.category.SubCategories.sort((a, b) => a.SequenceNumber - b.SequenceNumber);
      this.category.SubCategories.forEach(sub1 => {
        sub1.TempId = sub1.Id;
        if (sub1.SubCategories) {
          sub1.SubCategories = sub1.SubCategories.sort((a, b) => a.SequenceNumber - b.SequenceNumber);
          sub1.SubCategories.forEach(sub2 => {
            sub2.TempId = sub2.Id;
          })
        }
      })
    }
  }

  updateSequenceNumber() {
    if (this.category.SubCategories) {
      this.category.SubCategories.forEach((sub1: SubCategory1, index: number) => {
        sub1.SequenceNumber = index + 1;
        if (sub1.SubCategories) {
          sub1.SubCategories.forEach((sub2: SubCategory2, index: number) => {
            sub2.SequenceNumber = index + 1;
          });
        }
      })
    }
  }

  backToGrid() {
    this.onClose.emit();
    this._router.navigateByUrl('admin/loai-san-pham');
  }

  markAllControlDirty() {
    var keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
    })
  }

  uploadFile(event: Event) {
    showLoading();
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length) {
      var file = fileList[0];
      this._fileService.uploadFile(file, this.category.Id).subscribe(d => {
        this.category.DisplayImageUrl = d.Url;
        hideLoading();
      })
    }
  }

  moveDownSub1(index: number) {
    if (this.category.SubCategories && this.category.SubCategories[index] && this.category.SubCategories[index + 1]) {
      this.swapSub1(index, index + 1);
    }
  }
  moveUpSub1(index: number) {
    if (this.category.SubCategories && this.category.SubCategories[index] && this.category.SubCategories[index - 1]) {
      this.swapSub1(index, index - 1);
    }
  }

  swapSub1(from: number, to: number) {
    var temp = { ...this.category.SubCategories[from] };
    this.category.SubCategories[from] = this.category.SubCategories[to];
    this.category.SubCategories[to] = temp as SubCategory1;
  }

  moveDownSub2(parentIndex: number, index: number) {
    if (this.category.SubCategories[parentIndex] &&
      this.category.SubCategories[parentIndex].SubCategories[index] &&
      this.category.SubCategories[parentIndex].SubCategories[index + 1]) {
      this.swapSub2(parentIndex, index, index + 1);
    }
  }

  moveUpSub2(parentIndex: number, index: number) {
    if (this.category.SubCategories[parentIndex] &&
      this.category.SubCategories[parentIndex].SubCategories[index] &&
      this.category.SubCategories[parentIndex].SubCategories[index - 1]) {
      this.swapSub2(parentIndex, index, index - 1);
    }
  }

  swapSub2(parentIndex: number, from: number, to: number) {
    var sub1 = this.category.SubCategories[parentIndex];
    var temp = { ...sub1.SubCategories[from] };
    sub1.SubCategories[from] = this.category.SubCategories[to];
    sub1.SubCategories[to] = temp as SubCategory2;
  }
}
