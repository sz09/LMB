import {  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductType } from '../../../../models/product-type';
import { batch, isMobile, useBatchSizeByScreen } from '../../../../services/extentions';

@Component({
  selector: 'vat-pham-theo-ngu-hanh',
  templateUrl: './vat-pham-theo-ngu-hanh.component.html',
  styleUrls: ['./vat-pham-theo-ngu-hanh.component.css']
})
export class VatPhamTheoNguHanhComponent implements OnInit, AfterViewInit {

  azureFileStorage: string = environment.azureFileStorage;
  @Input() items!: ProductType[];
  productTypes: ProductType[][] = [];
  @Output() navigateByElement = new EventEmitter<string>();
  itemsPerRows: number = 5;
  itemsPerRowsMobile: number = 2;
  isMobile: boolean = isMobile();
  @ViewChildren('carouselRow') carouselRows!: QueryList<ElementRef>;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
      this.updateBatchViewItems();
      setTimeout(() => {
        this.markFirstItemActive();
      }, 200);
    }, this.resizeTimeout)
  }

  resizeTimeout = 100;
  resizeTimeoutId: any;
  constructor() { }
  ngAfterViewInit(): void {
    this.markFirstItemActive();
  }
  ngOnInit(): void {
    this.updateBatchViewItems();
  }
  getImageUrl(url: string) {
    return `${this.azureFileStorage}/${url}`;
  }

  markFirstItemActive() {
    if (this.carouselRows && this.carouselRows.length) {
      this.carouselRows.first.nativeElement.classList.add('active');
    }
  }
  updateBatchViewItems() {
    var batchSize = useBatchSizeByScreen(this.itemsPerRows, this.itemsPerRowsMobile);
    this.productTypes = batch(this.items, batchSize);
  }
}
