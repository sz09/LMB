import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.css']
})
export class TimeSelectorComponent implements OnInit {
  @Input() selectedTime!: Time;
  @Output() onSelectedTime = new EventEmitter<Time>();
  hour: string = '00';
  minute: string = '00';
  ngOnInit(): void {
    // Parse time
    if (this.selectedTime) {
      this.hour = this.to2Number(this.selectedTime.hours);
      this.minute = this.to2Number(this.selectedTime.minutes);
    }
  }
  onTimeChange() {
    var hour = Number(this.hour);
    var minute = Number(this.minute);
    this.onSelectedTime.emit({ hours: hour, minutes: minute })
  }

  to2Number(n: number) {
    return n < 10 ? '0' + n : n.toString();
  }
}
