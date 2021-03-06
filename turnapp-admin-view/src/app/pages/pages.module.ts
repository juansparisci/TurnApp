import { NgModule } from '@angular/core';


// import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';
import { ChartsModule } from 'ng2-charts';

// PipeModule
import { PipesModule } from '../pipes/pipes.module';

// temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ClinicasComponent } from './clinicas/clinicas.component';
import { ProfesionalesComponent } from './profesionales/profesionales.component';
import { ProfesionalComponent } from './profesionales/profesional.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ObrasSocialesComponent } from './obras-sociales/obras-sociales.component';
import { ObraSocialComponent } from './obras-sociales/obra-social.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { PacienteComponent } from './pacientes/paciente.component';
import { ClinicaComponent } from './clinicas/clinica.component';
import { OcupacionesComponent } from './ocupaciones/ocupaciones.component';
import { ProfesionesComponent } from './profesiones/profesiones.component';
import { ProfesionComponent } from './profesiones/profesion.component';
import { EspecialidadComponent } from './profesiones/especialidad/especialidad.component';
import { EspecialidadAsignadaComponent } from './clinicas/especialidad-asignada/especialidad-asignada.component';
@NgModule({
    declarations: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        RxjsComponent,
        ProfileComponent,
        UsuariosComponent,
        ClinicasComponent,
        ProfesionalesComponent,
        ProfesionalComponent,
        BusquedaComponent,
        ObrasSocialesComponent,
        ObraSocialComponent,
        PacientesComponent,
        PacienteComponent,
        ClinicaComponent,
        OcupacionesComponent,
        ProfesionesComponent,
        ProfesionComponent,
        EspecialidadComponent,
        EspecialidadAsignadaComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        CommonModule,
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        PipesModule
    ]
})
export class PagesModule {}
