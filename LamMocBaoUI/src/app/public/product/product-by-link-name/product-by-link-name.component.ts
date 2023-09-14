import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from '../../../../events/message.service';
import { CommonMessage } from '../../../../events/messages/common';
import { MessageType } from '../../../../events/messages/message-type';
import { CartItem } from '../../../../models/common/cart-item';
import { Product } from '../../../../models/product';
import { ContactInfo, getContactInfo, MetaKeyValue, MetaKeyWords } from '../../../../services/external-data';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'product-by-link-name',
  templateUrl: './product-by-link-name.component.html',
  styleUrls: ['./product-by-link-name.component.css']
})
export class ProductByLinkNameComponent implements OnInit, OnDestroy, AfterViewInit {
  contactInfo!: ContactInfo;
  linkName: string = '';
  product!: Product;
  selectedSizeId?: string;
  sellingPrice!: number;
  quantity: number = 1;
  isReadMore: boolean = true;
  validStates: { Size: boolean } = { Size: true };
  constructor(private _titleService: Title,
    private _productService: ProductService,
    private _messageService: MessageService,
    private router: Router,
    private _meta: Meta
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
}
  ngOnDestroy(): void {

    }
  ngAfterViewInit(): void {
    this.cutText();
  }

  cutText() {
    document.querySelectorAll('.small-text').forEach(d => {
      d.textContent = d.textContent?.slice(0, 300) ?? '';
    });
  }

  ngOnInit(): void {
    this.getLinkName(this.router.url)
    this.contactInfo = getContactInfo();
  }

  getLinkName(linkName: string) {
    this.linkName = linkName.substring(linkName.lastIndexOf("/") + 1);
    this.getProductInfor();
  }

  getProductInfor() {
    this._productService.getByLinkName(this.linkName).subscribe(d => {
      if (d.Data) {
        this.product = d.Data;
        this._titleService.setTitle(d.Data.Name);
        if (d.Data.Materials && d.Data.Materials.length) {
          d.Data.Materials.forEach(d => {
            this._meta.addTag({ name: MetaKeyWords.keywords, content: d.Name, charset: MetaKeyValue.charset })
          })
        }
        this._meta.addTag({ name: MetaKeyWords.keywords, content: d.Data.Name, charset: MetaKeyValue.charset })
        this._meta.addTag({ name: MetaKeyWords.description, content: d.Data.Description, charset: MetaKeyValue.charset })

        this.sellingPrice = d.Data.SellingPrice;
      }
      else {
        this.router.navigateByUrl('404');
      }
    })
  }
  getPrice(price: any) {
    return this.product.SellingPrice;
  }

  addToCart() {
    if (!this.selectedSizeId) {
      this.validStates.Size = false;
      return;
    }

    this.validStates.Size = true;
    this._messageService.sendMessage(new CommonMessage(MessageType.ArtToCart,
      new CartItem(this.product.Id, this.selectedSizeId, this.quantity)
    ));
  }

  onSizeChange(size: any) {
    if (!this.product.PriceBySizes || !this.product.PriceBySizes.length) {
      return;
    }

    this.validStates.Size = true;
    var priceBySize = this.product.PriceBySizes.find(d => d.SizeId === size.Id)?.SellingPrice;
    this.sellingPrice = priceBySize ?? this.product.SellingPrice;
  }



  showText() {
    this.isReadMore = !this.isReadMore;
  }

  toggleShowText() {
    this.isReadMore = !this.isReadMore;
    this.cutText();
  }
}
