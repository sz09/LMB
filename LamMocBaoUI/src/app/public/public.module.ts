import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from "ngx-bootstrap/carousel";
import { PopoverModule } from "ngx-bootstrap/popover";
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { LinkNameDirective } from '../../directives/link-name.directive';
import { LmbLinkDirective } from '../../directives/lmb-link.directive';
import { LMBCurrencyPipe } from '../../pipelines/lmb-currency';
import { ImageSliderComponent } from '../share-component/image-slider/image-slider.component';
import { ImageZoomSliderComponent } from '../share-component/image-zoom-slider/image-zoom-slider.component';
import { SharedModule } from '../shared.module';
import { LunarCalendarComponent } from '../shared/lunar-calendar/lunar-calendar.component';
import { TimeSelectorComponent } from '../shared/time-selector/time-selector.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppointmentCompleteComponent } from './appointment/appointment-complete/appointment-complete.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CartComponent } from './cart/cart.component';
import { OrderStatusDirectLinkComponent } from './cart/order-status-direct-link/order-status-direct-link.component';
import { BaoChiComponent } from './home-page/bao-chi/bao-chi.component';
import { CamNhanKhachHangComponent } from './home-page/cam-nhan-khach-hang/cam-nhan-khach-hang.component';
import { DanhMucSanPhamComponent } from './home-page/danh-muc-san-pham/danh-muc-san-pham.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KienThucComponent } from './home-page/kien-thuc/kien-thuc.component';
import { VatPhamTheoNguHanhComponent } from './home-page/vat-pham-theo-ngu-hanh/vat-pham-theo-ngu-hanh.component';
import { KnowledgeByLinkNameComponent } from './knowledge/knowledge-by-link-name/knowledge-by-link-name.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { ListLinkKnowledgeComponent } from './knowledge/list-link-knowledge/list-link-knowledge.component';
import { OrderCompleteComponent } from './order/order-complete/order-complete.component';
import { OrderComponent } from './order/order.component';
import { PaymentPolicyComponent } from './payment-policy/payment-policy.component';
import { ProductByLinkNameComponent } from './product/product-by-link-name/product-by-link-name.component';
import { ProductFilterByCategoryComponent } from './product/product-filter-by-category/product-filter-by-category.component';
import { ProductComponent } from './product/product.component';
import { SuggestionProductComponent } from './product/suggestion-product/suggestion-product.component';
import { ShippingPolicyComponent } from './shipping-policy/shipping-policy.component';
import { ShoppingGuideDetailsComponent } from './shopping-guide-details/shopping-guide-details.component';
import { WarrantyAndReturnsComponent } from './warranty-and-returns/warranty-and-returns.component';

@NgModule({
  declarations: [
    LmbLinkDirective,
    LinkNameDirective,

    HomePageComponent,
    VatPhamTheoNguHanhComponent,
    DanhMucSanPhamComponent,
    BaoChiComponent,
    KienThucComponent,
    CamNhanKhachHangComponent,
    ProductComponent,
    AppointmentComponent,
    KnowledgeComponent,
    ProductFilterByCategoryComponent,
    ImageSliderComponent,
    ProductByLinkNameComponent,
    ListLinkKnowledgeComponent,
    KnowledgeByLinkNameComponent,
    AppointmentCompleteComponent,
    CartComponent,
    OrderStatusDirectLinkComponent,
    LunarCalendarComponent,
    TimeSelectorComponent,
    OrderComponent,
    OrderCompleteComponent,
    SuggestionProductComponent,
    ShoppingGuideDetailsComponent,
    WarrantyAndReturnsComponent,
    ShippingPolicyComponent,
    PaymentPolicyComponent,
    ImageZoomSliderComponent,
    AboutUsComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    NgSelectModule,
    HttpClientModule,
    NgxImageZoomModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    CarouselModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [
    provideClientHydration()
  ]
})
export class PublicModule { }
