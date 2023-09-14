import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Size } from '../../../../models/size';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { SizeService } from '../../../../services/size.service';

@Component({
  selector: 'sizes-edit-admin',
  templateUrl: './sizes-edit-admin.component.html',
  styleUrls: ['./sizes-edit-admin.component.css']
})
export class SizesEditAdminComponent implements OnInit {
  isNew: boolean = false;
  size!: Size;
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _sizeService: SizeService,
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
          this._sizeService.loadById(d['id']).subscribe(d => {
            if (d.Data) {
              this.size = d.Data;
            }
          });
        }
        else {
          this.size = new Size();
        }
        this.isNew = !id;
      }, 500);
    })
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    if (this.isNew) {
      this._sizeService.create(this.size).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/kich-co/' + d);
      });
    }
    else {
      this._sizeService.update(this.size).subscribe(d => {
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
    this._router.navigateByUrl('admin/kich-co');
  }
}
