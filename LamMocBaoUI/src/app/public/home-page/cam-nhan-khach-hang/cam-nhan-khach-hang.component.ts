import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CustomerComment } from '../../../../models/customer-comment';
import { batch, useBatchSizeByScreen } from '../../../../services/extentions';

@Component({
  selector: 'cam-nhan-khach-hang',
  templateUrl: './cam-nhan-khach-hang.component.html',
  styleUrls: ['./cam-nhan-khach-hang.component.css']
})
export class CamNhanKhachHangComponent implements OnInit, AfterViewInit {

  @Input() customerComments: CustomerComment[] = [];
  @ViewChildren('carouselRow') carouselRows!: QueryList<ElementRef>;
  items: CustomerComment[][] = [];
  readonly itemsPerRows: number = 4;
  readonly itemsPerRowsMobile: number = 1;

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
  constructor() { }
  ngAfterViewInit(): void {
    this.markFirstItemActive();
  }

  ngOnInit(): void {
    this.updateBatchViewItems();
  }
  updateBatchViewItems() {
    var batchSize = useBatchSizeByScreen(this.itemsPerRows, this.itemsPerRowsMobile);
    this.items = batch(this.customerComments, batchSize);
  }
  markFirstItemActive() {
    if (this.carouselRows.length) {
      this.carouselRows.last.nativeElement.classList.add('active')
    }
  }
}
