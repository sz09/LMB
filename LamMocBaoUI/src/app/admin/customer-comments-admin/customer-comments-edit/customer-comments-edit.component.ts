import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerComment } from '../../../../models/customer-comment';
import { LiteFile } from '../../../../models/lite-file';
import { CustomerCommentsService } from '../../../../services/customer-comments.service';
import { hideLoading, showLoading } from '../../../../services/loader.service';

@Component({
  selector: 'customer-comments-edit',
  templateUrl: './customer-comments-edit.component.html',
  styleUrls: ['./customer-comments-edit.component.css']
})
export class CustomerCommentsEditComponent {
  isNew: boolean = false;
  customerComment!: CustomerComment;
  @Output()
  onClose = new EventEmitter<any>();
  images: LiteFile[] = [];
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _customerCommentsService: CustomerCommentsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._customerCommentsService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.customerComment = d.Data;
            var liteImage = new LiteFile();
            liteImage.Id = this.customerComment.UploadedImage.Id;
            liteImage.Url = this.customerComment.UploadedImage.Url;
            this.images.push(liteImage);
          }
        });
      }
      else {
        this.customerComment = new CustomerComment();
      }
      this.isNew = !id;
    })
  }
  onUploaded(file: LiteFile) {
    this.customerComment.UploadedImageId = file.Id;
    //console.log(file);
  }
  onRemove(id: string) {
    //console.log(id)
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    if (this.isNew) {
      this._customerCommentsService.create(this.customerComment).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/cam-nhan-khach-hang/' + d);
      });
    }
    else {
      this._customerCommentsService.update(this.customerComment).subscribe(d => {
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
    this._router.navigateByUrl('admin/cam-nhan-khach-hang');
  }

}
