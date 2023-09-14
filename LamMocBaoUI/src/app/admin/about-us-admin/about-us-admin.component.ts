import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import { AboutUs } from '../../../models/system-setting';
import { FileService } from '../../../services/file.service';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { SystemSettingService } from '../../../services/system-setting.service';

@Component({
  selector: 'app-about-us-admin',
  templateUrl: './about-us-admin.component.html',
  styleUrls: ['./about-us-admin.component.css']
})
export class AboutUsAdminComponent implements OnInit {
  constructor(private _fileService: FileService, private _systemSettingService: SystemSettingService) {
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
    showLoading();
    this._systemSettingService.load().subscribe(d => {
      this.model = new AboutUs();
      this.model.Id = d.Id;
      this.model.AboutUs = d.AboutUs;
      hideLoading();
    })
  }
  model!: AboutUs;
  modules = {}

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

  onSubmit() {
    showLoading();
    this._systemSettingService.updateAboutUs(this.model).subscribe(d => {
      hideLoading();
    })
  }
}
