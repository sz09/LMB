import { Component, Input, OnInit } from '@angular/core';
import { CartStatus } from '../../../../models/order';

@Component({
  selector: 'order-status-direct-link',
  templateUrl: './order-status-direct-link.component.html',
  styleUrls: ['./order-status-direct-link.component.css']
})
export class OrderStatusDirectLinkComponent implements OnInit {
  cartStatus = CartStatus;
  @Input() status!: CartStatus;
  constructor() { }

  ngOnInit(): void {
  }

}
