import { NgModule } from '@angular/core';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    PublicModule,
    AdminModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
