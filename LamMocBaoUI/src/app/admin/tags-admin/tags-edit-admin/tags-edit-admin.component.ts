import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../../../models/tag';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { TagService } from '../../../../services/tags.service';

@Component({
  selector: 'tags-edit-admin',
  templateUrl: './tags-edit-admin.component.html',
  styleUrls: ['./tags-edit-admin.component.css']
})
export class TagsEditAdminComponent {
  isNew: boolean = false;
  tag!: Tag;
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  constructor(private _tagService: TagService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._tagService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.tag = d.Data;
          }
        });
      }
      else {
        this.tag = new Tag();
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
      this._tagService.create(this.tag).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/tag/' + d);
      });
    }
    else {
      this._tagService.update(this.tag).subscribe(d => {
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
    this._router.navigateByUrl('admin/tag');
  }
}
