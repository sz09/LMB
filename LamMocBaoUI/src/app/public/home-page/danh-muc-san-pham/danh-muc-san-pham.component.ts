import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../../models/category';
import { batch, isMobile, useBatchSizeByScreen } from '../../../../services/extentions';
import { HomeService } from '../../../../services/home-page.service';

@Component({
  selector: 'danh-muc-san-pham',
  templateUrl: './danh-muc-san-pham.component.html',
  styleUrls: ['./danh-muc-san-pham.component.css']
})
export class DanhMucSanPhamComponent implements OnInit, AfterViewInit {
  azureCategoryImageStorage: string = environment.azureFileCategoryImages;
  @Input() categories: Category[] = [];
  @Input() useInFilter: boolean = false;
  @Input() selectedId?: string = '';
  @Output() navigateByCategory = new EventEmitter<string>();
  items: Category[][] = [];
  readonly displayCategoryPerRows: number = 6;
  readonly displayCategoryPerRowsMobile: number = 3;
  isMobile: boolean = isMobile();
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
      this.updateBatchViewItems();
      this.markFirstItemActive();
    }, this.resizeTimeout)
  }

  resizeTimeout = 100;
  resizeTimeoutId: any;
  @ViewChildren('carouselRow') carouselRows!: QueryList<ElementRef>;
  constructor(private _homeService: HomeService) { }
  ngAfterViewInit(): void {
    this.markFirstItemActive();
  }

  ngOnInit(): void {
    this.updateBatchViewItems();
  }

  updateBatchViewItems() {
    var batchSize = useBatchSizeByScreen(this.displayCategoryPerRows, this.displayCategoryPerRowsMobile)
    if (this.categories && this.categories.length) {
      this.items = batch(this.categories, batchSize);
      setTimeout(() => {
        this.markFirstItemActive();
      }, 200)
    }
    else {
      this._homeService.getHomePageConfig().subscribe(d => {
        this.categories = d.Categories;
        this.items = batch(this.categories, batchSize);
        setTimeout(() => {
          this.markFirstItemActive();
        }, 200)
      })
    }
  }

  markFirstItemActive() {
    if (this.carouselRows.length) {
      this.carouselRows.first.nativeElement.classList.add('active')
    }
  }

  onNavigateByCategory(id: string) {
    if (this.selectedId === id) {
      this.selectedId = '';
    }
    else {
      this.selectedId = id;
    }

    this.navigateByCategory.emit(this.selectedId);
  }

  isEvenItem(ix: number, rowLength: number, i: number) {
    return (ix + i) % 2 == 0;
  }
}
