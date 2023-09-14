import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppointmentCompleteComponent } from './appointment/appointment-complete/appointment-complete.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CartComponent } from './cart/cart.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KnowledgeByLinkNameComponent } from './knowledge/knowledge-by-link-name/knowledge-by-link-name.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { OrderCompleteComponent } from './order/order-complete/order-complete.component';
import { OrderComponent } from './order/order.component';
import { ProductByLinkNameComponent } from './product/product-by-link-name/product-by-link-name.component';
import { ProductComponent } from './product/product.component';
const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'trang-chu', component: HomePageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: 've-chung-toi', component: AboutUsComponent },
  { path: 'vat-pham', component: ProductComponent },
  { path: 'vat-pham/chat-lieu/:Material', component: ProductComponent },
  { path: 'vat-pham/nhom/:Group', component: ProductComponent },
  { path: 'vat-pham/ngu-hanh/:FiveElem', component: ProductComponent },
  { path: 'vat-pham/loai-san-pham/:Category', component: ProductComponent },
  { path: 'vat-pham/:linkName', component: ProductByLinkNameComponent },
  { path: 'dat-lich', component: AppointmentComponent },
  { path: 'dat-lich/hoan-thanh', component: AppointmentCompleteComponent },
  { path: 'dat-lich/:selected', component: AppointmentComponent },
  { path: 'kien-thuc', component: KnowledgeComponent },
  { path: 'kien-thuc/:linkName', component: KnowledgeByLinkNameComponent },
  { path: 'kien-thuc/preview/:id', component: KnowledgeByLinkNameComponent },
  { path: 'gio-hang', component: CartComponent },
  { path: 'dat-hang', component: OrderComponent },
  { path: 'dat-hang/thanh-cong', component: OrderCompleteComponent },
  { path: '**', redirectTo: '404' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
