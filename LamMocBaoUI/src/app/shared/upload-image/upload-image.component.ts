import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LiteFile } from '../../../models/lite-file';
import { format } from '../../../services/extentions';
import { FileService } from '../../../services/file.service';
import { hideLoading, showLoading } from '../../../services/loader.service';

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  @Input()
  entityId!: string;
  @Input()
  entityType!: string;
  @Input()
  allowMultiple: boolean = false;
  @Input()
  allowRemove: boolean = false;
  @Input()
  files: LiteFile[] = [];
  @Output()
  onUploaded = new EventEmitter<LiteFile>();
  @Output()
  onRemove = new EventEmitter<string>();
  _translateTexts: any = {};

  keysToTranslate: string[] = [
    'Common.AreYouSureToDeleteImage'
  ];
  constructor(private _fileService: FileService, private _translate: TranslateService) {
    
  }
  ngOnInit(): void {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
    })
    }
  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    showLoading();
    if (!this.allowMultiple) {
      if (fileList && fileList.length) {
        var file = fileList[0];
        this._fileService.uploadFile(file, this.entityId).subscribe(d => {
          this.onUploaded.emit(d);
          this.files = [d];
          hideLoading();
        })
      }
    }
    else {
      if (fileList && fileList.length) {
        var files: File[] = [];
        for (var i = 0; i < fileList.length; i++) {
          var file1 = fileList.item(i);
          if (file1) {
            files.push(file1);
          }
        }
        this._fileService.uploadFiles(files, this.entityId).subscribe(d => {
          if (this.entityType) {
            this._fileService.addFileFor(this.entityId, this.entityType, d).subscribe(r => {
              d.forEach(s => {
                this.onUploaded.emit(s);
                this.files.push(s);
              })
            })
          }
          else {
            d.forEach(s => {
              this.onUploaded.emit(s);
              this.files.push(s);
            })
          }
          hideLoading();
        })
      }
    }
  }
  removeImage(file: LiteFile) {
    if (this.allowRemove) {
      if (this.entityType) {
        if (confirm(this._translateTexts['Common.AreYouSureToDeleteImage'])) {
          this.files = this.files.filter(d => d.Id != file.Id);
          this._fileService.removeFileFor(file.Id, this.entityType).subscribe(d => {
            this.onRemove.emit(file.Id)
          })
        }
      }
      else {
        this.files = this.files.filter(d => d.Id != file.Id);
        this.onRemove.emit(file.Id)
      }
    }
  }
}
