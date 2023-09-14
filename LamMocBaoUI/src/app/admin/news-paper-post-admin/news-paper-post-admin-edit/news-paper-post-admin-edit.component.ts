import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiteFile } from '../../../../models/lite-file';
import { NewsPaperPost } from '../../../../models/news-paper-post';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { NewsPaperPostService } from '../../../../services/news-paper-post.service';

@Component({
  selector: 'news-paper-post-admin-edit',
  templateUrl: './news-paper-post-admin-edit.component.html',
  styleUrls: ['./news-paper-post-admin-edit.component.css']
})
export class NewsPaperPostAdminEditComponent {
  isNew: boolean = false;
  newsPaperPost!: NewsPaperPost;
  @Output()
  onClose = new EventEmitter<any>();
  images: LiteFile[] = [];
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _newsPaperPostService: NewsPaperPostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._newsPaperPostService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.newsPaperPost = d.Data;
            var liteImage = new LiteFile();
            liteImage.Id = this.newsPaperPost.UploadedImage.Id;
            liteImage.Url = this.newsPaperPost.UploadedImage.Url;
            this.images.push(liteImage);
          }
        });
      }
      else {
        this.newsPaperPost = new NewsPaperPost();
      }
      this.isNew = !id;
    })
  }
  onUploaded(file: LiteFile) {
    this.newsPaperPost.UploadedImageId = file.Id;
  }
  onRemove(id: string) {
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    if (this.isNew) {
      this._newsPaperPostService.create(this.newsPaperPost).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/bao-chi/' + d);
      });
    }
    else {
      this._newsPaperPostService.update(this.newsPaperPost).subscribe(d => {
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
    this._router.navigateByUrl('admin/bao-chi');
  }
}
