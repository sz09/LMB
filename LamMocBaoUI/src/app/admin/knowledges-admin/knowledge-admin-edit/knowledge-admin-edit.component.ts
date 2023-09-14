import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { KnowledgeViewModel } from '../../../../models/knowledge';
import { LiteFile } from '../../../../models/lite-file';
import { FileService } from '../../../../services/file.service';
import { newGuid } from '../../../../services/guid';
import { KnowledgeService } from '../../../../services/knowledge.service';
import { hideLoading, showLoading } from '../../../../services/loader.service';


import Quill from 'quill'
import BlotFormatter from 'quill-blot-formatter';
import { TagService } from '../../../../services/tags.service';
import { appendNoneForDropdown } from '../../../../services/extentions';
import { SelectListItem } from '../../../../models/common/SelectListItem';

Quill.register('modules/blotFormatter', BlotFormatter);


@Component({
  selector: 'knowledge-admin-edit',
  templateUrl: './knowledge-admin-edit.component.html',
  styleUrls: ['./knowledge-admin-edit.component.css']
})
export class KnowledgeAdminEditComponent implements OnInit {
  isNew: boolean = false;
  knowledge!: KnowledgeViewModel;
  images: LiteFile[] = [];
  @Output()
  onClose = new EventEmitter<any>();
  @ViewChild('f')
  private form!: NgForm;
  modules = {}
  tags: SelectListItem[] = [];
  selectedTags: SelectListItem[] = [];

  constructor(private _knowledgeService: KnowledgeService,
    private _router: Router,
    private _fileService: FileService,
    private _translate: TranslateService,
    private _tagService: TagService,
    private _activatedRoute: ActivatedRoute) {
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],                             // remove formatting button

        ['link', 'image']                         // link and image, video
      ],
      blotFormatter: {
      },
    }
  }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      var id = d['id'];
      if (id) {
        this._knowledgeService.loadById(id).subscribe(d => {
          if (d.Data) {
            this.knowledge = d.Data;
            this.knowledge.TagIds = this.knowledge.TagIds ?? [];
            var liteFile = new LiteFile();
            liteFile.Id = d.Data.UploadedImageId;
            liteFile.Url = d.Data.UploadedImageUrl;
            this.doShowTags();
            this.images = [
              liteFile
            ]
          }
        });
      }
      else {
        this.knowledge = new KnowledgeViewModel();
        this.knowledge.Id = newGuid();
      }
      this.isNew = !id;
    })

    this._tagService.getListDropdown().subscribe(d => {
      appendNoneForDropdown(d, this._translate).subscribe(d => {
        this.tags = d
        this.doShowTags();
      });
    })
  }

  doShowTags() {
    if (this.knowledge && this.knowledge.TagIds && this.knowledge.TagIds.length
      && (!this.selectedTags || this.selectedTags.length === 0)
      && (this.tags && this.tags.length)) {
      this.selectedTags = this.tags.filter(d => this.knowledge.TagIds.indexOf(d.Id) > -1);
    }
  }

  fakeTagId: string = '';
  addTag(item: SelectListItem) {
    if (!item.Id || this.knowledge.TagIds.indexOf(item.Id) > -1) {
      return;
    }

    this.knowledge.TagIds.push(item.Id);
    this.selectedTags.push(item);
    setTimeout(() => {
      this.fakeTagId = '';
    })
  }
  removeTag(item: SelectListItem) {
    this.knowledge.TagIds = this.knowledge.TagIds.filter(d => d !== item.Id);
    this.selectedTags = this.selectedTags.filter(d => d.Id !== item.Id);
  }
  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    showLoading();
    if (this.isNew) {
      this._knowledgeService.create(this.knowledge).subscribe(d => {
        hideLoading();
        this._router.navigateByUrl('/admin/kien-thuc/' + d);
      });
    }
    else {
      this._knowledgeService.update(this.knowledge).subscribe(d => {
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

  onUploaded(file: LiteFile) {
    this.knowledge.UploadedImageId = file.Id;
    this.knowledge.UploadedImageUrl = file.Url;
  }

  backToGrid() {
    this.onClose.emit();
    this._router.navigateByUrl('admin/kien-thuc');
  }

  onPreview() {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([`/kien-thuc/preview/${this.knowledge.Id}`])
    );

    window.open(url, '_blank');
  }
  quillEditorRef!: Quill;
  addBindingCreated(quill: Quill) {
    this.quillEditorRef = quill;
    const toolbar = this.quillEditorRef.getModule('toolbar');
    toolbar.addHandler('image', this.uploadImageHandler);
  }

  uploadImageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.length ? input.files[0] : null;
      const range = this.quillEditorRef.getSelection();
      if (file) {
        this._fileService.uploadImage(file).subscribe(d => {
          this.quillEditorRef.insertEmbed(range?.index ?? 0, 'image', d.body.imageUrl);
          setTimeout(() => {
            var img = document.querySelector(`img[src='${d.body.imageUrl}']`);
            if (img) {
              var parent = img.parentNode;
              parent?.addEventListener('click', (a: any) => {
                var r = img?.dispatchEvent(new Event('click'))
              })
            }
          })
        })
      }
    }
  }
}
