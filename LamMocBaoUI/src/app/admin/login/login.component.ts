import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { hideLoading } from '../../../services/loader.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  isError: boolean = false;
  showPassword: boolean = false;
  constructor(private _authService: AuthService,
    private _activedRoute: ActivatedRoute,
    private _router: Router) {
  }
    ngOnInit(): void {
      hideLoading();
    }

  doLogin() {
    this.isError = false;
    this._authService.login(this.username, this.password).subscribe(d => {
      if (d) {
        this._activedRoute.queryParams.subscribe(d => {
          var returnUrl = d['returnUrl']
          if (returnUrl) {
            this._router.navigateByUrl(returnUrl);
          }
          else {
            this._router.navigateByUrl('/admin/san-pham');
          }
        })
      }
      else {
        this.isError = true;
      }
    })
  }
}
