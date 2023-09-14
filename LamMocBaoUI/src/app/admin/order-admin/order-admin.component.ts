import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../events/message.service';
import { ShowMode } from '../../../models/common/show-mode';
import { LiteOrderModel } from '../../../models/order';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css']
})
export class OrderAdminComponent implements OnInit {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: LiteOrderModel[] = [];
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'CreatedAt desc',
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'Order.Name',
    'Order.CustomerName',
    'Order.Contact',
    'Label.Orders',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('contactTemplate')
  contactTemplate!: TemplateRef<any>;
  constructor(private _orderService: OrderService, private _translate: TranslateService, private _messageService: MessageService) {

  }
  ngOnInit(): void {
    setTimeout(() => this.loadColumn());
    this.loadData();
  }

  loadData() {
    showLoading();
    this._orderService.searchAdmin(this.payload).subscribe(d => {
      this.rows = d.Data;
      this.totalRows = d.Total;
      this.total = this.rows.length;
      hideLoading();
    })
  }

  loadColumn() {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
      this.columns = [
        {
          prop: 'FullName',
          minWidth: 250,
          name: this._translateTexts['Order.CustomerName'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
        },
        {
          minWidth: 200,
          name: this._translateTexts['Order.Contact'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.contactTemplate,
        },
        {
          width: 100,
          sortable: false,
          resizeable: false,
          canAutoResize: false,
          checkboxable: false,
          cellTemplate: this.actionTemplate,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        }
      ];
    });
  }
  create() {
    this.mode = ShowMode.Create;
  }

  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }

  getDisplayAddress(row: LiteOrderModel) {
    var address = [
      row.Address,
      row.Ward,
      row.District,
      row.Province
    ].filter(d => !!d);

    return address.join(', ');
  }
}
