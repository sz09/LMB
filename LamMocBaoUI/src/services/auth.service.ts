import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, concatMap, delay, map, Observable, of, retryWhen, throwError } from "rxjs";
import { MessageService } from "../events/message.service";
import { CommonMessage } from "../events/messages/common";
import { MessageType } from "../events/messages/message-type";
import { BaseService } from "./base-service";
import { hideLoading } from "./loader.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(private _http: HttpClient, private _router: Router,
    private _messageService: MessageService) {
    super();
  }

  login(username: string, password: string): Observable<boolean> {
    return this._http.post<any>(`${this.host}/api/login`, {
      Username: username,
      Password: password
    }, this.getRequestHeaders())
      .pipe(map(d => {
        if (d && d.AccessToken) {
          localStorage.setItem('c_user', JSON.stringify(d));
          setTimeout(() => {
            this._messageService.sendMessage(new CommonMessage(MessageType.Auth, username))
          })
          return true;
        }
        return false;
      }));
  }

  logout() {
    localStorage.removeItem('c_user');
    this._messageService.sendMessage(new CommonMessage(MessageType.Auth, ''))
    this._router.navigateByUrl('/admin/login');
  }

  getUser() {
    var userJson = localStorage.getItem('c_user');
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private router: Router,
    private _authService: AuthService
  ) { }

  canActivate(state: RouterStateSnapshot) {
    const user = this._authService.getUser();
    if (user) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

@Injectable()
export class DectectAdminInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('/admin/') > -1) {
      request = request.clone({
        headers: request.headers.set('IsAdmin', 'true')
      });
    }

    return next.handle(request);
  }
}

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this._authService.getUser();
    const isLoggedIn = user?.AccessToken;
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user.AccessToken}` }
      });
    }

    return next.handle(request);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService,
    private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this._authService.getUser()) {
        this._authService.logout();
        this.router.navigate(['/admin/login'], { queryParams: { returnUrl: this.router.url } })
      }
      else if ([500].includes(err.status)) {
        hideLoading();
        this.toastr.error('Có lỗi xảy ra. Vui lòng liên hệ administrator', 'Lỗi', {
          timeOut: 5000,
          closeButton: false
        })
      }

      const error = (err && err.error && err.error.message) || err.statusText;
      return throwError(() => error);
    }))
  }
}

export const retryCount = 3;
export const retryWaitMilliSeconds = 1000;

@Injectable()
export class MonitorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen(error =>
        error.pipe(
          concatMap((error, count) => {
            if (count <= retryCount && error.status == 503) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(retryWaitMilliSeconds)
        )
      )
    )
  }
}


export class User {
  Username!: string;
  AccessToken!: string;
  ExpiryDate!: Date;
}
