import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Appointment } from '../../../models/appointment';
import { AppointmentService } from '../../../services/appointment.service';
import { hideLoading, showLoading } from '../../../services/loader.service';

@Component({
  selector: 'app-appointment-admin',
  templateUrl: './appointment-admin.component.html',
  styleUrls: ['./appointment-admin.component.css']
})
export class AppointmentAdminComponent {
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: Appointment[] = [];
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
    'Appointment.Infos',
    'Appointment.Service',
    'Appointment.EmptyData',
    'Common.AreYouSureToDeleteItem'
  ];
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  interestServices: { Key: string, Value: string }[] = [];
  _translateTexts: any = {};

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('infosTemplate')
  infosTemplate!: TemplateRef<any>;
  @ViewChild('serviceTemplate')
  serviceTemplate!: TemplateRef<any>;
  constructor(
    private _appointmentService: AppointmentService,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this.loadData();
    this._appointmentService.getInterestServices().subscribe(d => {
      this.interestServices = d;
    })
    setTimeout(() => this.loadColumn());
  }

  loadData() {
    showLoading();
    this._appointmentService.searchAdmin(this.payload).subscribe(d => {
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
      this.gridMessage.emptyMessage = this._translateTexts['Appointment.EmptyData'];
      this.columns = [
        {
          minWidth: 200,
          name: this._translateTexts['Appointment.Infos'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.infosTemplate,
        },
        {
          minWidth: 400,
          name: this._translateTexts['Appointment.Service'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true,
          cellTemplate: this.serviceTemplate,
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

  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }

  getServiceName(row: Appointment) {
    return this.interestServices.find(d => d.Key == row.InterestedInService)?.Value;
  }

  getDisplayAddress(row: Appointment) {
    var address = [
      row.Address,
      row.Ward,
      row.District,
      row.Province
    ];
    return address.filter(d => !!d).join(', ');
  }
}
