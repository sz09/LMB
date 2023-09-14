import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressModel, DayType, DeliveryAddressModel, OrderDetailItem, OrderDetailModel, OrderStatus, PaymentMethod } from '../../../../models/order';
import { formatDateToLocale } from '../../../../services/extentions';
import { hideLoading, showLoading } from '../../../../services/loader.service';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'order-detail-admin',
  templateUrl: './order-detail-admin.component.html',
  styleUrls: ['./order-detail-admin.component.css']
})
export class OrderDetailAdminComponent implements OnInit {
  @Output()
  onClose = new EventEmitter<any>();

  order!: OrderDetailModel;
  paymentMethod = PaymentMethod;
  constructor(private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    var timeoutLoad: any;
    this._activatedRoute.params.subscribe(d => {
      if (timeoutLoad) {
        clearTimeout(timeoutLoad);
      }
      timeoutLoad = setTimeout(() => {
        var id = d['id'];
        if (id) {
          this._orderService.loadById(d['id']).subscribe(d => {
            if (d) {
              this.order = d;
              this._displayBirday = this.getDisplayBirday();
            }
          });
        }
      }, 500);
    })
  }
  getDisplayAddress(row: OrderDetailModel) {
    var address = [
      row.Address,
      row.Ward,
      row.District,
      row.Province
    ].filter(d => !!d);

    return address.join(', ');
  }

  getDisplayDeliveryAddress(row: DeliveryAddressModel) {
    var address = [
      row.Address,
      row.Ward,
      row.District,
      row.Province
    ].filter(d => !!d);

    return address.join(', ');
  }

  backToGrid() {
    this._router.navigateByUrl('admin/don-hang');
  }
  getTotalPrice(item: OrderDetailItem) {
    return item.Price * item.Quantity;
  }
  _totalPrice?: number;
  getTotalOrderPrice() {
    if (this._totalPrice) {
      return this._totalPrice;
    }
    var result: number = 0;
    this.order.OrderDetails.map(d => this.getTotalPrice(d)).forEach(d => {
      result += d;
    });
    this._totalPrice = result;
    return this._totalPrice;
  }

  _calculatedPrice?: number;
  getOrderStatusCss(orderStatus: number): string {
    switch (orderStatus) {
      case(OrderStatus.Ordered): return "btn btn-outline-info";
      case (OrderStatus.Paid): return "btn btn-outline-primary";
      case (OrderStatus.Prepared): return "btn btn-outline-warning";
      case (OrderStatus.Delivering): return "btn btn-outline-secondary";
      case (OrderStatus.Delivered): return "btn btn-outline-success";
      case (OrderStatus.Cancelled): return "btn btn-outline-danger";
      case (OrderStatus.ReturnedBack): return "btn btn-outline-dark";
      case (OrderStatus.Done): return "btn btn-success";
      default: return '';
    }
  }
  _statuses!: OrderStatus[];
  get statuses(): OrderStatus[] {
    if (this._statuses) {
      return this._statuses;
    }
    if (this.order.PaymentType === PaymentMethod.COD) {
      this._statuses = this.listStatuses.filter(d => d !== OrderStatus.Paid);
    }
    else {
      this._statuses = this.listStatuses;
    }

    return this._statuses;
  }

  listStatuses: OrderStatus[] = [
    OrderStatus.Ordered,
    OrderStatus.Paid,
    OrderStatus.Prepared,
    OrderStatus.Delivering,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
    OrderStatus.ReturnedBack,
    OrderStatus.Done,
  ];

  statusesDisallowChange: {
    Status: OrderStatus,
    DisallowStatus: OrderStatus[]
  }[] = [
      {
        Status: OrderStatus.Paid,
        DisallowStatus: [OrderStatus.Ordered]
      },
      {
        Status: OrderStatus.Prepared,
        DisallowStatus: [
          OrderStatus.Ordered,
          OrderStatus.Paid
        ]
      },
      {
        Status: OrderStatus.Delivering,
        DisallowStatus: [
          OrderStatus.Ordered,
          OrderStatus.Paid,
          OrderStatus.Prepared,
        ]
      },
      {
        Status: OrderStatus.Delivered,
        DisallowStatus: [
          OrderStatus.Ordered,
          OrderStatus.Paid,
          OrderStatus.Prepared,
          OrderStatus.Delivering,
          OrderStatus.Cancelled
        ]
      },
      {
        Status: OrderStatus.Cancelled,
        DisallowStatus: [
        ]
      },
      {
        Status: OrderStatus.ReturnedBack,
        DisallowStatus: [
          OrderStatus.Ordered,
          OrderStatus.Paid
        ]
      }

    ];
  changeToStatus(orderStatus: number) {
    if (!this.canChangeToStatus(orderStatus)) {
      return;
    }
    showLoading();
    this._orderService.changeToStatus(this.order.Id, orderStatus).subscribe(d => {
      hideLoading();
      this.order.OrderStatus = orderStatus;
    })
  }

  getOrderStatusName(orderStatus: number): string {
    switch (orderStatus) {
      case (OrderStatus.Ordered): return "Status.Ordered";
      case (OrderStatus.Paid): return "Status.Paid";
      case (OrderStatus.Prepared): return "Status.Prepared";
      case (OrderStatus.Delivering): return "Status.Delivering";
      case (OrderStatus.Delivered): return "Status.Delivered";
      case (OrderStatus.Cancelled): return "Status.Cancelled";
      case (OrderStatus.ReturnedBack): return "Status.ReturnedBack";
      case (OrderStatus.Done): return "Status.Completed";
      default: return '';
    }
  }
  canChangeToStatus(orderStatus: number) {
    var disallowChangeToStatus = this.statusesDisallowChange.find(d => d.Status == this.order.OrderStatus);
    if (disallowChangeToStatus && disallowChangeToStatus.DisallowStatus) {
      return disallowChangeToStatus.DisallowStatus.findIndex(d => d == orderStatus) == -1;
    }

    return true;
  }

  getDisplayBirthDay() {
    return `Common.${DayType[this.order.Customer.BirthDayType]}`;
  }
  _displayBirday: string = '';
  getDisplayBirday() {
    if (this.order.Customer.Birthday) {
      return formatDateToLocale(this.order.Customer.Birthday)
    }
    return '';
  }
}
