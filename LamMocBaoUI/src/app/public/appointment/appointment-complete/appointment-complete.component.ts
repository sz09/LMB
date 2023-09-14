import { Component, OnInit } from '@angular/core';
import { getContactInfo } from '../../../../services/external-data';

@Component({
  selector: 'appointment-complete',
  templateUrl: './appointment-complete.component.html',
  styleUrls: ['./appointment-complete.component.css']
})
export class AppointmentCompleteComponent implements OnInit {
  params: {
    phoneNumber: string
  } = { phoneNumber: '' };
  contactInfo = getContactInfo();
  constructor() { }

  ngOnInit(): void {
  }
}
