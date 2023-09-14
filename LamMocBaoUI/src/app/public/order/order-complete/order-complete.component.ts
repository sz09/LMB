import { Component, OnInit } from '@angular/core';
import { CartStatus } from '../../../../models/order';
import { OrderSuccessInfos } from '../../../../models/order-success-info';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {
  cartStatus = CartStatus;
  orderSuccessInfos!: OrderSuccessInfos;
  constructor(private _cartService: CartService) {
  }
  ngOnInit(): void {
    this._cartService.getOrderSuccessInfos().subscribe(d => {
      this.orderSuccessInfos = d;
    })
  }
}
