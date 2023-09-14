import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductType } from '../../../../models/product-type';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { ProductTypeService } from '../../../../services/product-type.service';

@Component({
  selector: 'file-elements-admin-edit',
  templateUrl: './file-elements-admin-edit.component.html',
  styleUrls: ['./file-elements-admin-edit.component.css']
})
export class FileElementsAdminEditComponent {
  isNew: boolean = false;
  productType!: ProductType;
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _productTypeService: ProductTypeService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._productTypeService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.productType = d.Data;
          }
        });
      }
      else {
        this.productType = new ProductType();
      }
      this.isNew = !id;
    })
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    if (this.isNew) {
      //this._productTypeService.create(this.tag).subscribe(d => {
      //  hideLoading();
      //});
    }
    else {
      this._productTypeService.update(this.productType).subscribe(d => {
        hideLoading();
      });
    }
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
    this._router.navigateByUrl('admin/ngu-hanh');
  }

}
