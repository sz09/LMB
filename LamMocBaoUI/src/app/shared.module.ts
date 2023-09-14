import { CommonModule, DatePipe, DecimalPipe, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import localeVN from '@angular/common/locales/vi';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { MessageService } from '../events/message.service';
import { ErrorInterceptor, JwtInterceptor, MonitorInterceptor } from '../services/auth.service';
import { AppComponent } from './app.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundPageComponent } from './public/not-found-page/not-found-page.component';
import { PreparingComponent } from './public/preparing/preparing.component';
import { LMBCurrencyPipe } from '../pipelines/lmb-currency';
import { AdminNavigationComponent } from './admin/admin-navigation/admin-navigation.component';
import { FormsModule } from '@angular/forms';
registerLocaleData(localeVN);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export class SharedMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params.key;
  }
}
@NgModule({
  declarations: [
    AppComponent,
    PaginationComponent,
    PreparingComponent,
    NotFoundPageComponent,
    LMBCurrencyPipe,
    AdminNavigationComponent,
  ],
  imports: [
    NgOptimizedImage,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'vn',
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: SharedMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    BsModalService,
    MessageService,
    DatePipe,
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MonitorInterceptor, multi: true }
  ],
  exports: [
    NgOptimizedImage,
    TranslateModule,
    AppRoutingModule,
    AppComponent,
    PaginationComponent,
    PreparingComponent,
    NotFoundPageComponent,
    LMBCurrencyPipe,
    AdminNavigationComponent
  ]
})
export class SharedModule {}
