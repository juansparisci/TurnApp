import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardGuard, AdminGuard, VerificaTokenGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ClinicasComponent } from './clinicas/clinicas.component';
import { ClinicaComponent } from './clinicas/clinica.component';
import { ProfesionalesComponent } from './profesionales/profesionales.component';
import { ProfesionalComponent } from './profesionales/profesional.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ObrasSocialesComponent } from './obras-sociales/obras-sociales.component';
import { ObraSocialComponent } from './obras-sociales/obra-social.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { PacienteComponent } from './pacientes/paciente.component';
import { OcupacionesComponent } from './ocupaciones/ocupaciones.component';
import { ProfesionesComponent } from './profesiones/profesiones.component';
import { ProfesionComponent } from './profesiones/profesion.component';
import { EspecialidadComponent } from './profesiones/especialidad/especialidad.component';
import { EspecialidadAsignadaComponent } from './clinicas/especialidad-asignada/especialidad-asignada.component';

const pagesRoutes: Routes = [
    //#region pruebas
    {path: 'dashboard', component: DashboardComponent, canActivate: [VerificaTokenGuard], data: {titulo: 'Dashboard'}},
   /* { path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBars'} },
    { path: 'graficas1', component: Graficas1Component, data: {titulo: 'Graficas'} },
    { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'} },
    { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'} },*/
//#endregion
    { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de Tema'} },
    { path: 'perfil', component: ProfileComponent, data: {titulo: 'Perfil de Usuario'} },
    { path: 'busqueda/:termino', component: BusquedaComponent, data: {titulo: 'Buscador'} },
    // Mantenimientos
    {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AdminGuard],
        data: {titulo: 'Mantenimiento de Usuarios'}
    },
    {
        path: 'obras-sociales',
        component: ObrasSocialesComponent,
        canActivate: [AdminGuard],
        data: {titulo: 'Mantenimiento de Obras Sociales'}
    },
    { path: 'obra-social/:id', component: ObraSocialComponent, data: {titulo: 'Actualizar Obra Social'} },
    { path: 'clinicas', component: ClinicasComponent, data: {titulo: 'Mantenimiento de Clínicas'} },
    { path: 'profesionales', component: ProfesionalesComponent, data: {titulo: 'Mantenimiento de Profesionales'} },
    { path: 'pacientes', component: PacientesComponent, data: {titulo: 'Mantenimiento de Pacientes'} },
    { path: 'profesional/:id', component: ProfesionalComponent, data: {titulo: 'Actualizar Profesional'} },
    { path: 'paciente/:id', component: PacienteComponent, data: {titulo: 'Actualizar Paciente'} },
    { path: 'ocupaciones', component: OcupacionesComponent, data: {titulo: 'Ocupaciones'} },
    { path: 'profesiones', component: ProfesionesComponent, data: {titulo: 'Profesiones'} },
    { path: 'profesion/:id', component: ProfesionComponent, data: {titulo: 'Profesión'} },
    { path: 'profesion/especialidad/:idProfesion/:idEspecialidad', component: EspecialidadComponent, data: {titulo: 'Especialidad'} },
    { path: 'clinica/especialidad/:idClinica/:idProfesion/:idEspecialidad',
      component: EspecialidadAsignadaComponent, data: {titulo: 'Especialidad Asignada'} },
    { path: 'clinica/:id', component: ClinicaComponent, data: {titulo: 'Actualizar Clinica'} },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
