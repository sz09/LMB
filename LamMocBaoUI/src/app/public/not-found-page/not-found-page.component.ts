import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit {
  constructor(private _titleService: Title, private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this._translate.get('Error.404Page').subscribe(d => {
      this._titleService.setTitle(d);
    })
  }
  eyeStyle1: any = {};
  eyeStyle2: any = {};
  @ViewChild('eye1')
  eye1!: ElementRef;
  @ViewChild('eye2')
  eye2!: ElementRef;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.eye1) {
      let x = (this.eye1.nativeElement.offsetLeft) + (this.eye1.nativeElement.offsetWidth / 2);
      let y = (this.eye1.nativeElement.offsetTop) + (this.eye1.nativeElement.offsetHeight / 2);
      let rad = Math.atan2(event.pageX - x, event.pageY - y);
      let rot = (rad * (180 / Math.PI) * -1) + 180;
      this.eyeStyle1['-webkit-transform']= 'rotate(' + rot + 'deg)';
      this.eyeStyle1['-transform']= 'rotate(' + rot + 'deg)';
    }
    if (this.eye2) {
      let x = (this.eye2.nativeElement.offsetLeft) + (this.eye2.nativeElement.offsetWidth / 2);
      let y = (this.eye2.nativeElement.offsetTop) + (this.eye2.nativeElement.offsetHeight / 2);
      let rad = Math.atan2(event.pageX - x, event.pageY - y);
      let rot = (rad * (180 / Math.PI) * -1) + 180;
      this.eyeStyle2['-webkit-transform']= 'rotate(' + rot + 'deg)';
      this.eyeStyle2['-transform']= 'rotate(' + rot + 'deg)';
    }
  }
}
