import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { QuillModule } from 'ngx-quill';
import { DectectAdminInterceptor } from '../../services/auth.service';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared.module';
import { UploadImageComponent } from '../shared/upload-image/upload-image.component';
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

@NgModule({
  declarations: [
    SystemSettingsComponent,
    LoginComponent,
    UploadImageComponent,
    AboutUsAdminComponent,

    CategoryAdminComponent,
    CategoryAdminEditComponent,
    ProductAdminComponent,
    ProductAdminEditAdminComponent,
    OrderAdminComponent,
    OrderDetailAdminComponent,
    AppointmentAdminComponent,
    AppointmentViewAdminComponent,
    FiveElementsAdminComponent,
    FileElementsAdminEditComponent,
    MaterialsAdminComponent,
    MaterialAdminEditComponent,
    TagsAdminComponent,
    TagsEditAdminComponent,
    SizesAdminComponent,
    SizesEditAdminComponent,
    NewsPaperPostAdminComponent,
    NewsPaperPostAdminEditComponent,
    CustomerCommentsAdminComponent,
    CustomerCommentsEditComponent,
    KnowledgesAdminComponent,
    KnowledgeAdminEditComponent,
    PromotionsAdminComponent,
    PromotionEditAdminComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    HttpClientModule,
    NgxImageZoomModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatDialogModule,
    QuillModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DectectAdminInterceptor, multi: true }
  ]
})
export class AdminModule { }
