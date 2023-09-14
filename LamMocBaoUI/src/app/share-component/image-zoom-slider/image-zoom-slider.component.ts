import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadedImage } from '../../../models/uploaded-image';

@Component({
  selector: 'image-zoom-slider',
  templateUrl: './image-zoom-slider.component.html',
  styleUrls: ['./image-zoom-slider.component.css']
})
export class ImageZoomSliderComponent implements OnInit {
  image!: UploadedImage;
  isDisplay(i: number) {
    return this.showingStates.length && this.showingStates.find(d => d.Index == i)?.IsDisplay;
  }
  showingStates: { Index: number, IsDisplay: boolean }[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.image = data.image;
  }
  ngOnInit(): void {
    
  }

  
}
