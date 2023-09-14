import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UploadedImage } from '../../../models/uploaded-image';
import { ImageZoomSliderComponent } from '../image-zoom-slider/image-zoom-slider.component';

@Component({
  selector: 'image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  showingStates: { Index: number, IsDisplay: boolean }[] = [];
  constructor(public dialog: MatDialog) { }
  @Input() images!: UploadedImage[];

  @ViewChildren('preview') previewElems!: QueryList<ElementRef>
  @ViewChild('previewSlider') previewSlider!: ElementRef
  ngOnInit(): void {
    this.maxHeight = window.innerHeight - 100;
    this.images.forEach((item, i) => {
      this.showingStates.push({ Index: i, IsDisplay: false });
    });
    if (this.showingStates.length) {
      this.showingStates[0].IsDisplay = true;
    }
  }

  showImage(i: number) {
    this.showingStates.forEach(d => {
      d.IsDisplay = d.Index === i;
    });
    var previewElem = this.previewElems.get(i);
    if (previewElem) {
      var widthPerPreviewItem = this.previewSlider.nativeElement.offsetWidth / this.previewElems.length;
      var left = i * widthPerPreviewItem;
      this.previewSlider.nativeElement.scrollTo({
        left: Math.ceil(left),
        behavior: 'smooth'
      });
    }
  }

  next() {
    var currentIndex = this.getCurrentShowing();
    var nextIndex = currentIndex + 1;
    if (nextIndex === this.showingStates.length) {
      nextIndex = 0;
    }
    this.showImage(nextIndex);

  }

  prev() {
    var currentIndex = this.getCurrentShowing();
    var prevIndex = currentIndex - 1;
    if (prevIndex === -1) {
      prevIndex = this.showingStates.length - 1;
    }
    this.showImage(prevIndex);
  }

  getCurrentShowing() {
    return this.showingStates.find(d => d.IsDisplay)?.Index ?? -1;
  }
  maxHeight: number = 0;
  getWidthByRatio(width: number, ratio: number) {
    return (width * ratio);
  }
  
  timeOutSetStyle: any;
  openDialogImage(image: UploadedImage, event: any) {
    var openDialog = (size: any, isError: boolean = false) => {
      if (!size || isError) {
        return;
      }
      var decidedHeight = Math.min(size.height, this.maxHeight);
      var ratioByHeight = this.maxHeight / size.height;
      var dialogSize = {
        height: decidedHeight + 'px',
        width: Math.min(this.getWidthByRatio(size.width, ratioByHeight), size.width) + 'px'
      };
      const dialogRef = this.dialog.open(ImageZoomSliderComponent, {
        height: dialogSize.height,
        width: dialogSize.width,
        data: {
          image: image
        }
      });
      if (this.timeOutSetStyle) {
        clearTimeout(this.timeOutSetStyle);
      }

      var body = document.getElementsByTagName('body').item(0)

      this.timeOutSetStyle = setTimeout(() => {
        var img = document.querySelector('.ngxImageZoomContainer > img') as any;
        img.style.height = dialogSize.height;
        img.style.width = dialogSize.width;
        img.oncontextmenu = () => { return false };
        body?.classList.add('zoom-open');
      });

      dialogRef.afterClosed().subscribe(d => {
        body?.classList.remove('zoom-open');
      })
    }

    this.getMeta(image.Url, openDialog);
  }

  getMeta(url: string, cb: any) {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb({}, true);
    img.src = url;
    cb && cb({
      height: img.naturalHeight,
      width: img.naturalWidth,
    });
  }
}
