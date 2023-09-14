import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from '../../../../models/appointment';
import { DayType } from '../../../../models/order';
import { AppointmentService } from '../../../../services/appointment.service';
import { formatDateToLocale } from '../../../../services/extentions';

@Component({
  selector: 'app-appointment-view-admin',
  templateUrl: './appointment-view-admin.component.html',
  styleUrls: ['./appointment-view-admin.component.css']
})
export class AppointmentViewAdminComponent implements OnInit {
  appointment!: Appointment;
  interestServices: { Key: string, Value: string }[] = [];
  constructor(private _appointmentService: AppointmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) { }
  ngOnInit(): void {
    this._appointmentService.getInterestServices().subscribe(d => {
      this.interestServices = d;
    })
    var timeoutLoad: any;
    this._activatedRoute.params.subscribe(d => {
      if (timeoutLoad) {
        clearTimeout(timeoutLoad);
      }
      timeoutLoad = setTimeout(() => {
        var id = d['id'];
        if (id) {
          this._appointmentService.loadById(d['id']).subscribe(d => {
            if (d) {
              this.appointment = d.Data;
            }
          });
        }
      }, 500);
    })
  }

  getDisplayAddress() {
    var address = [
      this.appointment.Address,
      this.appointment.Ward,
      this.appointment.District,
      this.appointment.Province
    ];
    return address.filter(d => !!d).join(', ');
  }
  getDisplayBirthDay() {
    return `Common.${DayType[this.appointment.BirthDayType]}`;
  }

  getDisplayBirday() {
    if (this.appointment.BirthDay) {
      return formatDateToLocale(this.appointment.BirthDay)
    }
    return '';
  }
  getDisplayService() {
    if (this.appointment.InterestedInService) {
      return this.interestServices.find(d => d.Key == this.appointment.InterestedInService)?.Value ?? '';
    }
    return '';
  }
  backToGrid() {
    this._router.navigateByUrl('admin/dat-lich');
  }
}
