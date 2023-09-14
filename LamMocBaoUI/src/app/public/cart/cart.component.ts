import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../events/message.service';
import { CommonMessage } from '../../../events/messages/common';
import { MessageType } from '../../../events/messages/message-type';
import { CartItem } from '../../../models/common/cart-item';
import { Keys } from '../../../models/common/const';
import { PromotionInfo } from '../../../models/common/promotion-info';
import { CartStatus } from '../../../models/order';
import { ProductCart } from '../../../models/product-cart';
import { CartService } from '../../../services/cart.service';
import { isMobile } from '../../../services/extentions';
import { PromotionCodeService } from '../../../services/promotion-code.service';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productCarts: ProductCart[] = [];
  get sumPrice() {
    var sum = 0;
    this.productCarts.map(d => d.Quantity * d.Price).forEach(d => { sum += d });
    return sum;
  }
  get sumPriceAfterDiscount() {
    var sumPrice = this.sumPrice;
    this.discountParams.Total =  (sumPrice / 100 * this.discountParams.Percent);
    var priceAfterDiscount = sumPrice - this.discountParams.Total;
    return priceAfterDiscount;
  }
  cartStatus = CartStatus;
  promotionCode!: string;
  isValidCode: boolean = true;
  discountParams: PromotionInfo = new PromotionInfo();
  
  isMobile: boolean = isMobile();
  resizeTimeout = 100;
  resizeTimeoutId: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
    }, this.resizeTimeout)
  }
  constructor(private _cartService: CartService,
    private _promotionCodeService: PromotionCodeService,
    private _router: Router,
    private _titleService: Title,
    private _translateService: TranslateService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    this._translateService.get('Title.Carts').subscribe(d => {
      this._titleService.setTitle(d);
    })
    var fromLocalStorage = localStorage.getItem(Keys.Product_Carts.toLowerCase());
    if (fromLocalStorage) {
      var cartItems = JSON.parse(fromLocalStorage) as CartItem[];

      this._cartService.getFullCartInfos(cartItems).subscribe(productCarts => {
        this.productCarts = productCarts;
      })
    }
  }
  doPayment() {
    var url = `dat-hang` + (this.isValidCode && this.promotionCode ? `?code=${this.promotionCode}` : ''); 
    this._router.navigateByUrl(url);
  }

  updateCart() {
    this._messageService.sendMessage(new CommonMessage(MessageType.UpdateCart, this.productCarts));
  }

  removeProduct(productId: string) {
    this.productCarts = this.productCarts.filter(d => d.Id !== productId);
    this.updateCart();
  }

  getTotalPrice(item: ProductCart) {
    return item.Price * item.Quantity;
  }

  onPromotionCodeChange() {
    this._promotionCodeService.getPromotionCode(this.promotionCode).subscribe(d => {
      if (d.IsFound) {
        this.discountParams.Percent = d.DiscountPercent;
      }
      else {
        this.discountParams.Percent = 0;
      }

      this.isValidCode = d.IsFound;
    })
  }
}
