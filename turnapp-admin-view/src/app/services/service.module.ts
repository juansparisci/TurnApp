import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
        SettingsService,
        SidebarService,
        SharedService,
        UsuarioService,
        ClinicaService,
        ProfesionalService,
        PacienteService,
        LoginGuardGuard,
        AdminGuard,
        SubirArchivoService,
        VerificaTokenGuard,
        ObraSocialService,
        ProfesionService
      } from './service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    ClinicaService,
    ProfesionalService,
    ProfesionService,
    PacienteService,
    LoginGuardGuard,
    AdminGuard,
    SubirArchivoService,
    ModalUploadService,
    VerificaTokenGuard,
    ObraSocialService
  ],
  declarations: []
})
export class ServiceModule { }
