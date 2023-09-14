import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Directive({
  selector: '[link-name]'
})
export class LinkNameDirective implements OnInit {

  @Input('resource-type') resourceType: string = '';
  @Input('resourve-value') resourveValue: string = '';
  constructor(private router: Router) {
    
  }
  ngOnInit(): void {
  }

  @HostListener('click') onClick() {
    this.router.navigateByUrl(`${this.getRouteApiByType()}/${this.resourveValue}`);
  }
  getRouteApiByType(): string {
    switch (this.resourceType) {
      case 'Product':
        return 'vat-pham';
      default:
        return '';
    }
  }
}
