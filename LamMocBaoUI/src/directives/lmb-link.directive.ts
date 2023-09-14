import { Directive, ElementRef, Input, OnInit } from '@angular/core';


@Directive({
  selector: '[lmb-link]'
})
export class LmbLinkDirective implements OnInit {

  @Input() resourceType: string = '';
  @Input() additionalInfo: string = '';
  constructor(private el: ElementRef) {
    
  }
  ngOnInit(): void {
    var href = `/${this.getRouteApiByType()}${this.additionalInfo}`;
    this.el.nativeElement.href = href;
  }

  getRouteApiByType(): string {
    switch (this.resourceType) {
      case 'Product':
        return 'product';
      default:
        return '';
    }
  }
}
