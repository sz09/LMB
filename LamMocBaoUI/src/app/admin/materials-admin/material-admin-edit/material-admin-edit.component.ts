import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from '../../../../models/material';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { MaterialService } from '../../../../services/material.service';

@Component({
  selector: 'material-admin-edit',
  templateUrl: './material-admin-edit.component.html',
  styleUrls: ['./material-admin-edit.component.css']
})
export class MaterialAdminEditComponent {
  isNew: boolean = false;
  material!: Material;
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _materialService: MaterialService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._materialService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.material = d.Data;
          }
        });
      }
      else {
        this.material = new Material();
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
      this._materialService.create(this.material).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/chat-lieu/' + d);
      });
    }
    else {
      this._materialService.update(this.material).subscribe(d => {
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
    this._router.navigateByUrl('admin/chat-lieu');
  }

}
