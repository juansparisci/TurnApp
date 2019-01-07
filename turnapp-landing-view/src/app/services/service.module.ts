import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
        ClinicaService,
        SubirArchivoService
      } from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ClinicaService,
    SubirArchivoService
  ],
  declarations: [  ]
})
export class ServiceModule { }
