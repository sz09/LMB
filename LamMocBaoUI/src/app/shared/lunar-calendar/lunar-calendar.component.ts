import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { batch } from '../../../services/extentions';
import { DateMarker, getDaysOfMonth, LunarDate, Month } from '../../../services/lunar-calendar.service';

@Component({
  selector: 'lunar-calendar',
  templateUrl: './lunar-calendar.component.html',
  styleUrls: ['./lunar-calendar.component.css']
})
export class LunarCalendarComponent implements OnInit {
  today: Date = new Date();
  month: number = this.today.getMonth() + 1;
  year: number = this.today.getFullYear();
  todayMarker!: DateMarker;
  selectedMonth: Month = new Month(this.month, this.year);
  dateMarkers: DateMarker[] = [];
  dateMarkersRows: DateMarker[][] = [];
  @Input() selectedDate!: DateMarker;
  @Output() onSelectDate = new EventEmitter<DateMarker>();
  readonly NUMBER_DATE_IN_WEEK = 7;
  ngOnInit(): void {
    if (this.selectedDate && this.selectedDate.solarDate) {
      // Run select month
      this.selectedMonth = new Month(this.selectedDate.solarDate.getMonth() + 1, this.selectedDate.solarDate.getFullYear());
    }
    this.getDaysOfMonth(this.selectedMonth);
    this.todayMarker = new DateMarker();
    this.todayMarker.solarDate = this.today;
  }

  getDaysOfMonth(month: Month) {
    this.selectedMonth = month;
    this.month = month.Month;
    this.year = month.Year;
    this.dateMarkers = getDaysOfMonth(month.Month, month.Year);
    if (this.dateMarkers && this.dateMarkers[0].solarDate) {
      var startIndex = this.dateMarkers[0].solarDate.getDay();
      var list: DateMarker[] = [];
      for (var i = 0; i < startIndex; i++) {
        var dateMarker = new DateMarker();
        dateMarker.isEmpty = true;
        list.push(dateMarker);
      }

      var savedMonth = -1;
      for (var i = 0; i < this.dateMarkers.length; i++) {
        var dateMarker = this.dateMarkers[i];
        if (dateMarker.lunarDate.month != savedMonth) {
          dateMarker.isShowMonth = true;
          if (i > 0) {
            list[startIndex + i - 1].isShowMonth = true;
          }
          savedMonth = dateMarker.lunarDate.month;
        }

        list.push(dateMarker);
      }
        
      this.dateMarkersRows = batch(list, this.NUMBER_DATE_IN_WEEK);
      var last = this.dateMarkersRows[this.dateMarkersRows.length - 1];
      const lastLength = last.length;
      if (lastLength < this.NUMBER_DATE_IN_WEEK) {
        const needToAddMore = this.NUMBER_DATE_IN_WEEK - lastLength;
        for (var i = 0; i < needToAddMore; i++) {
          var dateMarker = new DateMarker();
          dateMarker.isEmpty = true;
          last.push(dateMarker);
        }
      }
    }
  }

  getDisplayLunarDay(date: DateMarker): string {
    if (date.isShowMonth) {
      return `${date.lunarDate.day}/${date.lunarDate.month}`
    }

    return date.lunarDate.day.toString();
  }

  prevMonth() {
    var prevMonth = new Date(this.selectedMonth.Year, this.selectedMonth.Month);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    var monthNumber = prevMonth.getMonth();
    if (monthNumber == 0) {
      prevMonth.setFullYear(prevMonth.getFullYear() - 1);
      monthNumber = 12;
    }
    this.getDaysOfMonth(new Month(monthNumber, prevMonth.getFullYear()));
  }

  nextMonth() {
    var nextMonth = new Date(this.selectedMonth.Year, this.selectedMonth.Month);
    this.getDaysOfMonth(new Month(nextMonth.getMonth() + 1, nextMonth.getFullYear()));
  }

  changeDirectFromInput() {
    this.getDaysOfMonth(new Month(this.month, this.year));
  }

  selectDate(item: DateMarker) {
    this.onSelectDate.emit(item);
    this.selectedDate = item;
  }

  isSame(item1: DateMarker, compareTo: DateMarker) {
    return compareTo && compareTo.solarDate?.getDate() == item1.solarDate?.getDate() &&
      compareTo.solarDate?.getMonth() == item1.solarDate?.getMonth() &&
      compareTo.solarDate?.getFullYear() == item1.solarDate?.getFullYear();
  }
}
