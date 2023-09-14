import { Component, Input, OnInit } from '@angular/core';
import { SuggestionProduct } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'suggestion-product',
  templateUrl: './suggestion-product.component.html',
  styleUrls: ['./suggestion-product.component.css']
})
export class SuggestionProductComponent implements OnInit {
  @Input() productId!: string;
  suggestionProducts: SuggestionProduct[] = [];

  constructor(private _productService: ProductService) {

  }
  ngOnInit(): void {
    this._productService.getSuggestionProducts(this.productId).subscribe(d => {
      this.suggestionProducts = d;
    })
  }
}
