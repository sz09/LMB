import { Component, OnInit } from '@angular/core';
import { SystemSetting } from '../../../models/system-setting';
import { hideLoading, showLoading } from '../../../services/loader.service';
import { SystemSettingService } from '../../../services/system-setting.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit {
  systemSetting!: SystemSetting;
  constructor(private _systemSettingService: SystemSettingService) { }
  ngOnInit(): void {
    showLoading();
    this._systemSettingService.load().subscribe(d => {
      this.systemSetting = d;
      hideLoading();
    });
    }
  onSubmit() {
    showLoading();
    this._systemSettingService.save(this.systemSetting).subscribe(d => {

      hideLoading();
    })
  }
}
