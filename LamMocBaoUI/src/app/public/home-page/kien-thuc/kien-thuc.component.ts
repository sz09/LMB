import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { PublishedKnowledge } from '../../../../models/knowledge';
import { batch, isMobile, mobileWidth, useBatchSizeByScreen } from '../../../../services/extentions';

@Component({
  selector: 'kien-thuc',
  templateUrl: './kien-thuc.component.html',
  styleUrls: ['./kien-thuc.component.css']
})
export class KienThucComponent implements OnInit, AfterViewInit{

  @Input() knowledges: PublishedKnowledge[] = [];
  items: PublishedKnowledge[][] = [];
  readonly itemsPerRows: number = 4;
  readonly itemsPerRowsMobile: number = 2;
  @ViewChildren('carouselRow') carouselRows!: QueryList<ElementRef>;
  isMobile: boolean = isMobile();

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
  constructor(private _router: Router) { }
  ngAfterViewInit(): void {
    if (this.carouselRows.length) {
      this.carouselRows.last.nativeElement.classList.add('active')
    }
  }

  ngOnInit(): void {
    this.updateBatchViewItems();
  }
  updateBatchViewItems() {
    var batchSize = useBatchSizeByScreen(this.itemsPerRows, this.itemsPerRowsMobile);
    this.items = batch(this.knowledges, batchSize);
  }
  markFirstItemActive() {
    if (this.carouselRows.length) {
      this.carouselRows.last.nativeElement.classList.add('active')
    }
  }
  navigateToKnowledge() {
    this._router.navigateByUrl('/kien-thuc');
  }
}
