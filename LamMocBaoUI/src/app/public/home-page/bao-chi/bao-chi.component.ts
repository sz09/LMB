import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NewsPaperPost } from '../../../../models/news-paper-post';
import { batch, useBatchSizeByScreen } from '../../../../services/extentions';

@Component({
  selector: 'bao-chi',
  templateUrl: './bao-chi.component.html',
  styleUrls: ['./bao-chi.component.css']
})
export class BaoChiComponent implements OnInit, AfterViewInit {

  @Input() newsPaperPosts: NewsPaperPost[] = [];
  @ViewChildren('carouselRow') carouselRows!: QueryList<ElementRef>;
  items: NewsPaperPost[][] = [];
  readonly itemsPerRows: number = 4;
  readonly itemsPerRowsMobile: number = 1;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.updateBatchViewItems();
      setTimeout(() => {
        this.markFirstItemActive();
      }, 200);
    }, this.resizeTimeout)
  }

  resizeTimeout = 100;
  resizeTimeoutId: any;
  ngAfterViewInit(): void {
    this.markFirstItemActive();
  }

  ngOnInit(): void {
    this.updateBatchViewItems();
  }
  updateBatchViewItems() {
    var batchSize = useBatchSizeByScreen(this.itemsPerRows, this.itemsPerRowsMobile);
    this.items = batch(this.newsPaperPosts, batchSize);
  }
  markFirstItemActive() {
    if (this.carouselRows.length) {
      this.carouselRows.first.nativeElement.classList.add('active')
    }
  }
}
