import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';

@NgModule({
  imports: [
    PublicModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
