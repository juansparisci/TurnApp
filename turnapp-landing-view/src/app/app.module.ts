import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceModule } from './services/service.module';
 import { APP_ROUTES } from './app.routes';
import { PipesModule } from './pipes/pipes.module';
import { ModalUploadComponent } from './components/modal-upload/modal-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalUploadComponent
  ],
  imports: [
    BrowserModule,
    ServiceModule,
    APP_ROUTES,
    PipesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
