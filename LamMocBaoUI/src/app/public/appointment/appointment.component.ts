import { DatePipe, Time } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../../models/appointment';
import { District, Province, Ward } from '../../../models/common/address';
import { DayType } from '../../../models/order';
import { AppointmentService } from '../../../services/appointment.service';
import { ContactInfo, getContactInfo } from '../../../services/external-data';
import { FileService } from '../../../services/file.service';
import { DateMarker } from '../../../services/lunar-calendar.service';

@Component({
  selector: 'appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointment: Appointment = new Appointment();
  contactInfo: ContactInfo = getContactInfo();
  invalid: boolean = false;
  birthDayType = DayType;
  interestServices: { Key: string, Value: string }[] = [];
  sourceInterestServices: { Key: string, Value: string }[] = [];
  get interestServiceValue() {
    return this.sourceInterestServices.find(d => d.Key == this.appointment?.InterestedInService)?.Value;
  }
  azureFileStorage: string = environment.azureFileStorage;
  DayType = DayType;
  provinces: Province[] = [];
  get districts(): District[] {
    var districts = this.provinces.find(d => d.Id === this.appointment.Province)?.Districts ?? [];
    if (districts.findIndex(d => d.Id == this.nullStr) === -1) {
      districts.unshift({ Id: this.nullStr, Name: this.translatedTexts['Appointment.District'], Wards: [] })
    }
    return districts;
  }
  get wards(): Ward[] {
    var wards = this.districts.find(d => d.Id === this.appointment.District)?.Wards ?? [];
    if (wards.findIndex(d => d.Id == this.nullStr) === -1) {
      wards.unshift({ Id: this.nullStr, Name: this.translatedTexts['Appointment.Ward'], Level: '' })
    }
    return wards;
  };
  selectedBirthday: DateMarker = new DateMarker();
  selectedTime!: Time;
  isCalendarOpen: boolean = false;
  isTimeOpen: boolean = false;
  get timeStr(): string {
    return this._datePipe.transform(this.appointment.BirthDay, 'HH:mm') ?? '';
  }
  translatedTexts: any = {};
  nullStr = '';

  @ViewChild('f')
  private form!: NgForm;
  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fileService: FileService,
    private _translate: TranslateService,
    private _titleService: Title,
    private _datePipe: DatePipe,
    private _appointmentService: AppointmentService) { }

  supportServices = [
    "dang-ky-thiet-ke-vat-pham-ca-nhan",//: "Tư vấn thiết kế vật phẩm",
    "lien-he", //: "Liên hệ hỗ trợ khác",
    "dat-lich-xem-menh-so-voi-chuyen-gia" //: "Đặt lịch các nhân với chuyên gia"
  ]
  ngOnInit(): void {
    this.appointment.InterestedInService = 'lien-he';
    this._activatedRoute.params.subscribe(d => {
      var selected = d['selected'];
      if (this.supportServices.indexOf(selected) > -1) {
        this.appointment.InterestedInService = selected;
      }
    })
    this._translate.get(['Appointment.Province', 'Appointment.District', 'Appointment.Ward']).subscribe(d => {
      this.translatedTexts = d;
    })
    this._appointmentService.getInterestServices().subscribe(d => {
      this.sourceInterestServices = d;
      this.interestServices = d.filter(e => this.supportServices.indexOf(e.Key) > -1);
      this.appointment.BirthDayType = DayType.SolarCalendar;

      this._translate.get('Label.Appointments').subscribe(title => {
        this._titleService.setTitle(`${title} - ${d.find(d => d.Key == this.appointment.InterestedInService)?.Value}`);
      })
    });
    this._fileService.getVNAddress().subscribe(provinces => {
      this.provinces = provinces;
      this.ensureFirstItemOfAddress();
    })
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  onSubmit() {
    this.markAllControlDirty();
    if (!this.form.valid) {
      return;
    }

    this._appointmentService.makeAAppointment(this.appointmentAfterCorrectAddress()).subscribe(d => {
      this._router.navigateByUrl('dat-lich/hoan-thanh');
    })
  }

  appointmentAfterCorrectAddress(): Appointment {
    var appointment = { ...this.appointment }
    if (appointment.Ward) {
      appointment.Ward = this.wards.find(d => d.Id == appointment.Ward)?.Name ?? '';
    }
    if (appointment.District) {
      appointment.District = this.districts.find(d => d.Id == appointment.District)?.Name ?? '';
    }
    if (appointment.Province) {
      appointment.Province = this.provinces.find(d => d.Id == appointment.Province)?.Name ?? '';
    }
    return appointment;
  }
  
  markAllControlDirty() {
    var keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
    })
  }

  getImageUrl(fileUrl: string) {
    return this.azureFileStorage + '/' + fileUrl;
  }

  onProvinceChange() {
    this.appointment.District = this.nullStr;
    this.onDistrictChange();
  }

  onDistrictChange() {
    this.onResetWard();
  }

  onResetProvince() {
    setTimeout(() => this.appointment.Province = this.nullStr);
    this.onResetDistrict();
  }

  onResetDistrict() {
    setTimeout(() => this.appointment.District = this.nullStr);
    this.onResetWard();
  }

  onResetWard() {
    setTimeout(() => this.appointment.Ward = this.nullStr);
  }

  ensureFirstItemOfAddress() {
    var provinces = [...this.provinces];
    if (provinces.findIndex(d => d.Id == this.nullStr) === -1) {
      provinces.unshift({ Id: this.nullStr, Name: this.translatedTexts['Appointment.Province'], Districts: [] })
    }
    this.provinces = provinces;
  }

  onSelectDate(event: DateMarker) {
    switch (this.appointment.BirthDayType) {
      case DayType.LunarCalendar:
        this.appointment.BirthDay = new Date(event.lunarDate.year, event.lunarDate.month -1, event.lunarDate.day);
        break;
      case DayType.SolarCalendar:
        this.appointment.BirthDay = event.solarDate;
        break;
    }
    this.selectedBirthday = event;
    if (!this.selectedTime) {
      this.selectedTime = {
        hours: this.appointment.BirthDay?.getHours() ?? 0,
        minutes: this.appointment.BirthDay?.getMinutes() ?? 0
      }
    }
    else {
      this.appointment.BirthDay?.setHours(this.selectedTime.hours);
      this.appointment.BirthDay?.setMinutes(this.selectedTime.minutes);
    }
    this.isCalendarOpen = false;
  }

  onSelectedTime(event: Time) {
    this.isTimeOpen = false;
    if (this.appointment.BirthDay) {
      this.appointment.BirthDay.setHours(event.hours);
      this.appointment.BirthDay.setMinutes(event.minutes);
    }
    this.selectedTime = event;
  }

  onToggleTime() {
    if (!this.appointment.BirthDay) {
      return;
    }
    this.isTimeOpen = !this.isTimeOpen;
    this.isCalendarOpen = false;
  }

  onToggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    this.isTimeOpen = false;
  }
}
