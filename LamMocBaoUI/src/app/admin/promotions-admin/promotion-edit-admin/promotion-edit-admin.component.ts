import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Promotion, PromotionMode } from '../../../../models/promotion-code';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { PromotionCodeService } from '../../../../services/promotion-code.service';

@Component({
  selector: 'promotion-edit-admin',
  templateUrl: './promotion-edit-admin.component.html',
  styleUrls: ['./promotion-edit-admin.component.css']
})
export class PromotionEditAdminComponent {
  isNew: boolean = false;
  promotion!: Promotion;
  promotionMode = PromotionMode;
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _promotionService: PromotionCodeService,
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
          this._promotionService.loadById(d['id']).subscribe(d => {
            if (d) {
              this.promotion = d;
            }
          });
        }
        else {
          this.promotion = new Promotion();
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
      this._promotionService.create(this.promotion).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl(`/admin/khuyen-mai/${d}`);
      });
    }
    else {
      this._promotionService.update(this.promotion).subscribe(d => {
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
    this._router.navigateByUrl('admin/khuyen-mai');
  }
}
