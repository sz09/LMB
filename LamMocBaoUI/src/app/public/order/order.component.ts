import { DatePipe, Time } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../events/message.service';
import { CommonMessage } from '../../../events/messages/common';
import { MessageType } from '../../../events/messages/message-type';
import { BirthDayType } from '../../../models/appointment';
import { District, Province, Ward } from '../../../models/common/address';
import { CartItem } from '../../../models/common/cart-item';
import { Keys } from '../../../models/common/const';
import { PromotionInfo } from '../../../models/common/promotion-info';
import { CartStatus, DayType, DeliveryAddressModel, OrderModel, PaymentMethod } from '../../../models/order';
import { ProductCart } from '../../../models/product-cart';
import { CartService } from '../../../services/cart.service';
import { isMobile } from '../../../services/extentions';
import { PaymentInfos } from '../../../services/external-data';
import { FileService } from '../../../services/file.service';
import { DateMarker } from '../../../services/lunar-calendar.service';
import { PromotionCodeService } from '../../../services/promotion-code.service';
import { SystemSettingService } from '../../../services/system-setting.service';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  cartStatus = CartStatus;
  order!: OrderModel;
  paymentInfos: PaymentInfos = new PaymentInfos();
  promotionInfo: any;
  productCarts: ProductCart[] = [];
  birthDayType = BirthDayType;
  provinces: Province[] = [];
  get districts(): District[] {
    var districts = this.provinces.find(d => d.Id === this.order.Address.ProvinceId)?.Districts ?? [];
    if (districts.findIndex(d => d.Id == this.nullStr) === -1) {
      districts.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.District'], Wards: [] })
    }
    return districts;
  };
  get wards(): Ward[] {
    var wards = this.districts.find(d => d.Id === this.order.Address.DistrictId)?.Wards ?? [];
    if (wards.findIndex(d => d.Id == this.nullStr) === -1) {
      wards.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.Ward'], Level: '' })
    }
    return wards;
  };
  provinces2: Province[] = [];
  get districts2(): District[] {
    var districts2 = this.provinces2.find(d => d.Id === this.order.DeliveryAddress.ProvinceId)?.Districts ?? [];
    if (districts2.findIndex(d => d.Id == this.nullStr) === -1) {
      districts2.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.Ward'], Wards: [] })
    }
    return districts2;
  };
  get wards2(): Ward[] {
    var wards2 = this.districts2.find(d => d.Id === this.order.DeliveryAddress.DistrictId)?.Wards ?? [];
    if (wards2.findIndex(d => d.Id == this.nullStr) === -1) {
      wards2.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.Ward'], Level: '' })
    }
    return wards2;
  };

  get timeStr(): string {
    return this._datePipe.transform(this.order.Customer.BirthDay, 'HH:mm') ?? '';
  }
  isOrdering: boolean = false;
  selectedBirthday: DateMarker = new DateMarker();
  selectedTime!: Time;
  isCalendarOpen: boolean = false;
  isTimeOpen: boolean = false;
  nullStr: string = '';
  discountParams: PromotionInfo = new PromotionInfo();
  get sumPrice() {
    var sum = 0;
    this.productCarts.map(d => d.Quantity * d.Price).forEach(d => { sum += d });
    return sum;
  }
  get sumPriceAfterDiscount() {
    var sumPrice = this.sumPrice;
    this.discountParams.Total = (sumPrice / 100 * this.discountParams.Percent);
    var priceAfterDiscount = sumPrice - this.discountParams.Total;
    return priceAfterDiscount;
  }
  translatedTexts: any = {};

  @ViewChild('f')
  private form!: NgForm;
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
  constructor(private _systemSettingService: SystemSettingService,
    private _fileService: FileService,
    private _promotionCodeService: PromotionCodeService,
    private _messageService: MessageService,
    private _translate: TranslateService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _datePipe: DatePipe,
    private _cartService: CartService) {

  }
  paymentMethod = PaymentMethod;
  ngOnInit(): void {
    this.order = new OrderModel();
    this.order.PaymentType = PaymentMethod.BankTranfer;
    this._translate.get(['Order.Province', 'Order.District', 'Order.Ward']).subscribe(d => {
      this.translatedTexts = d;
    })
    this._route.queryParams.subscribe(params => {
      this.order.PromotionCode = params['code'] ?? '';
      this.onPromotionCodeChange();
    });
    this._systemSettingService.getPaymentInfos().subscribe(d => {
      this.paymentInfos = d;
    });

    this._fileService.getVNAddress().subscribe(provinces => {
      this.provinces = [...provinces];
      this.provinces2 = [...provinces];
      if (this.provinces.findIndex(d => d.Id == this.nullStr) === -1) {
        this.provinces.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.Province'], Districts: [] })
      }
      if (this.provinces2.findIndex(d => d.Id == this.nullStr) === -1) {
        this.provinces2.unshift({ Id: this.nullStr, Name: this.translatedTexts['Order.Province'], Districts: [] })
      }
    });

    var fromLocalStorage = localStorage.getItem(Keys.Product_Carts.toLowerCase());
    if (fromLocalStorage) {
      var cartItems = JSON.parse(fromLocalStorage) as CartItem[];

      this._cartService.getFullCartInfos(cartItems).subscribe(productCarts => {
        this.productCarts = productCarts;
      })
    }
  }

  getTotalPrice(item: ProductCart) {
    return item.Price * item.Quantity;
  }

  onProvinceChange() {
    this.order.Address.District = this.nullStr;
    this.onDistrictChange();
  }

  onResetProvince() {
    setTimeout(() => this.order.Address.Province = this.nullStr);
    this.onResetDistrict();
  }

  onResetDistrict() {
    setTimeout(() => this.order.Address.District = this.nullStr);
    this.onResetWard();
  }

  onResetWard() {
    setTimeout(() => this.order.Address.Ward = this.nullStr);
  }
  onProvince2Change() {
    this.order.DeliveryAddress.District = this.nullStr;
    this.onDistrict2Change();
  }

  onDistrictChange() {
    this.order.Address.Ward = this.nullStr;
  }

  onDistrict2Change() {
    this.order.DeliveryAddress.Ward = this.nullStr;
  }

  onResetProvince2() {
    setTimeout(() => this.order.DeliveryAddress.Province = this.nullStr);
    this.onResetDistrict();
  }

  onResetDistrict2() {
    setTimeout(() => this.order.DeliveryAddress.District = this.nullStr);
    this.onResetWard();
  }

  onResetWard2() {
    setTimeout(() => this.order.DeliveryAddress.Ward = this.nullStr);
  }
  onSelectDate(event: DateMarker) {
    switch (this.order.Customer.BirthDayType) {
      case DayType.LunarCalendar:
        this.order.Customer.BirthDay = new Date(event.lunarDate.year, event.lunarDate.month - 1, event.lunarDate.day);
        break;
      case DayType.SolarCalendar:
        this.order.Customer.BirthDay = event.solarDate;
        break;
    }
    this.selectedBirthday = event;
    this.isCalendarOpen = false;
  }

  onSelectedTime(event: Time) {
    this.isTimeOpen = false;
    if (this.order.Customer.BirthDay) {
      this.order.Customer.BirthDay.setHours(event.hours);
      this.order.Customer.BirthDay.setMinutes(event.minutes);
    }
    this.selectedTime = event;
  }

  onToggleTime() {
    this.isTimeOpen = !this.isTimeOpen;
    this.isCalendarOpen = false;
  }

  onToggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    this.isTimeOpen = false;
  }

  onPromotionCodeChange() {
    if (this.order.PromotionCode) {
      this._promotionCodeService.getPromotionCode(this.order.PromotionCode).subscribe(d => {
        if (d.IsFound) {
          this.discountParams.Percent = d.DiscountPercent;
        }
        else {
          this.discountParams.Percent = 0;
        }
      })
    }
  }

  doOrder() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }
    // Correct address with value instead of id
    this.correctMainContact();
    this.correctDeliveryContact();
    this.isOrdering = true;
    this._cartService.doOrder(this.order, this.productCarts, this.order.PromotionCode)
      .subscribe(d => {
        if (d.Success) {
          this._messageService.sendMessage(new CommonMessage(MessageType.UpdateCart, []))
          this._router.navigateByUrl('/dat-hang/thanh-cong');
          this.isOrdering = false;
        }
        else {

        }
      })
  }
  markAllControlDirty() {
    var keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
    })
  }

  correctMainContact() {
    this.order.Address.Province = this.provinces.find(d => d.Id == this.order.Address.ProvinceId)?.Name ?? '';
    this.order.Address.District = this.districts.find(d => d.Id == this.order.Address.DistrictId)?.Name ?? '';
    this.order.Address.Ward = this.wards.find(d => d.Id == this.order.Address.WardId)?.Name ?? '';
  }

  correctDeliveryContact() {
    if (this.order.IsDeliveryToAnotherAddress) {
      this.order.DeliveryAddress.Province = this.provinces2.find(d => d.Id == this.order.DeliveryAddress.ProvinceId)?.Name ?? '';
      this.order.DeliveryAddress.District = this.districts2.find(d => d.Id == this.order.DeliveryAddress.DistrictId)?.Name ?? '';
      this.order.DeliveryAddress.Ward = this.wards2.find(d => d.Id == this.order.DeliveryAddress.WardId)?.Name ?? '';
    }
    else {
      this.order.DeliveryAddress = new DeliveryAddressModel();
    }
  }
}
