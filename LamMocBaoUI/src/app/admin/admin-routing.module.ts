import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.service';
import { AboutUsAdminComponent } from './about-us-admin/about-us-admin.component';
import { AppointmentAdminComponent } from './appointment-admin/appointment-admin.component';
import { AppointmentViewAdminComponent } from './appointment-admin/appointment-view-admin/appointment-view-admin.component';
import { CategoryAdminEditComponent } from './category-admin/category-admin-edit/category-admin-edit.component';
import { CategoryAdminComponent } from './category-admin/category-admin.component';
import { CustomerCommentsAdminComponent } from './customer-comments-admin/customer-comments-admin.component';
import { CustomerCommentsEditComponent } from './customer-comments-admin/customer-comments-edit/customer-comments-edit.component';
import { FileElementsAdminEditComponent } from './five-elements-admin/file-elements-admin-edit/file-elements-admin-edit.component';
import { FiveElementsAdminComponent } from './five-elements-admin/five-elements-admin.component';
import { KnowledgeAdminEditComponent } from './knowledges-admin/knowledge-admin-edit/knowledge-admin-edit.component';
import { KnowledgesAdminComponent } from './knowledges-admin/knowledges-admin.component';
import { LoginComponent } from './login/login.component';
import { MaterialAdminEditComponent } from './materials-admin/material-admin-edit/material-admin-edit.component';
import { MaterialsAdminComponent } from './materials-admin/materials-admin.component';
import { NewsPaperPostAdminEditComponent } from './news-paper-post-admin/news-paper-post-admin-edit/news-paper-post-admin-edit.component';
import { NewsPaperPostAdminComponent } from './news-paper-post-admin/news-paper-post-admin.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { OrderDetailAdminComponent } from './order-admin/order-detail-admin/order-detail-admin.component';
import { ProductAdminEditAdminComponent } from './product-admin/product-admin-edit-admin/product-admin-edit-admin.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { PromotionEditAdminComponent } from './promotions-admin/promotion-edit-admin/promotion-edit-admin.component';
import { PromotionsAdminComponent } from './promotions-admin/promotions-admin.component';
import { SizesAdminComponent } from './sizes-admin/sizes-admin.component';
import { SizesEditAdminComponent } from './sizes-admin/sizes-edit-admin/sizes-edit-admin.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { TagsAdminComponent } from './tags-admin/tags-admin.component';
import { TagsEditAdminComponent } from './tags-admin/tags-edit-admin/tags-edit-admin.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ProductAdminComponent },
  { path: 'loai-san-pham', component: CategoryAdminComponent, canActivate: [AuthGuard] },
  { path: 'loai-san-pham/:id', component: CategoryAdminEditComponent, canActivate: [AuthGuard] },
  { path: 'san-pham', component: ProductAdminComponent, canActivate: [AuthGuard] },
  { path: 'san-pham/:id', component: ProductAdminEditAdminComponent, canActivate: [AuthGuard] },
  { path: 'don-hang', component: OrderAdminComponent, canActivate: [AuthGuard] },
  { path: 'don-hang/:id', component: OrderDetailAdminComponent, canActivate: [AuthGuard] },
  { path: 'dat-lich', component: AppointmentAdminComponent, canActivate: [AuthGuard] },
  { path: 'dat-lich/:id', component: AppointmentViewAdminComponent, canActivate: [AuthGuard] },
  { path: 'ngu-hanh', component: FiveElementsAdminComponent, canActivate: [AuthGuard] },
  { path: 'ngu-hanh/:id', component: FileElementsAdminEditComponent, canActivate: [AuthGuard] },
  { path: 'kich-co', component: SizesAdminComponent, canActivate: [AuthGuard] },
  { path: 'kich-co/:id', component: SizesEditAdminComponent, canActivate: [AuthGuard] },
  { path: 'chat-lieu', component: MaterialsAdminComponent, canActivate: [AuthGuard] },
  { path: 'chat-lieu/:id', component: MaterialAdminEditComponent, canActivate: [AuthGuard] },
  { path: 'tag', component: TagsAdminComponent, canActivate: [AuthGuard] },
  { path: 'tag/:id', component: TagsEditAdminComponent, canActivate: [AuthGuard] },
  { path: 'bao-chi', component: NewsPaperPostAdminComponent, canActivate: [AuthGuard] },
  { path: 'bao-chi/:id', component: NewsPaperPostAdminEditComponent, canActivate: [AuthGuard] },
  { path: 'cam-nhan-khach-hang', component: CustomerCommentsAdminComponent, canActivate: [AuthGuard] },
  { path: 'cam-nhan-khach-hang/:id', component: CustomerCommentsEditComponent, canActivate: [AuthGuard] },
  { path: 'kien-thuc', component: KnowledgesAdminComponent, canActivate: [AuthGuard] },
  { path: 'kien-thuc/:id', component: KnowledgeAdminEditComponent, canActivate: [AuthGuard] },
  { path: 'khuyen-mai', component: PromotionsAdminComponent, canActivate: [AuthGuard] },
  { path: 'khuyen-mai/:id', component: PromotionEditAdminComponent, canActivate: [AuthGuard] },
  { path: 've-chung-toi', component: AboutUsAdminComponent, canActivate: [AuthGuard] },
  { path: 'system-setting', component: SystemSettingsComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
