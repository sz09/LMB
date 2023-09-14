import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'preparing',
  templateUrl: './preparing.component.html',
  styleUrls: ['./preparing.component.css']
})
export class PreparingComponent implements OnInit {

  constructor() { }
  azureFileStorage: string = environment.azureFileStorage;

  ngOnInit(): void {
  }

}
