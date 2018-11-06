import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Clinica } from '../../models/clinica.model';
import { UsuarioService } from '../usuario/usuario.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  public totalClinicas: number = 0;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService,
    private router: Router
  ) { }
  cargarClinicas() {
    const url = URL_SERVICIOS + '/clinica';
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalClinicas = resp.clinicas.length;
        return resp.clinicas;
       }),
       catchError( err => {
        swal('Error al cargar clínicas', err.error.mensaje, 'error');
        return throwError(err);
      })
    );
  }
  obtenerClinica( id: string ) {
    const url = URL_SERVICIOS + '/clinica/' + id;
    return this.http.get(url);
  }
  obtenerClinicaPorUrl( pUrl: string ) {
    const url = URL_SERVICIOS + '/clinica/url/' + pUrl;
    return this.http.get(url);
  }
  guardarClinica( clinica: Clinica ) {
    let url = URL_SERVICIOS + '/clinica/';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, clinica ).pipe(
    map( (resp: any) => {
      swal('Clinica creada', clinica.nombre, 'success');
      return resp.clinica;
    }),
    catchError( err => {
     swal('Error al guardar clínica', err.error.mensaje, 'error');
     return throwError(err);
   })
  );
  }
  actualizarClinica(clinica: Clinica) {
    let url = URL_SERVICIOS + '/clinica/' + clinica._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, clinica).pipe(
      map( (resp: any) => {
        swal('Clinica actualizada', clinica.nombre, 'success');
        return clinica;
      }),
      catchError( err => {
       swal('Error al actualizar clínica', err.error.mensaje, 'error');
       if (err.status === 401) {
        this.router.navigate(['login']);
       }
       return throwError(err);
     })
    );
  }
  buscarClinicas( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/clinicas/' + termino;
    return this.http.get( url )
      .pipe(
        map((resp: any) => {
          this.totalClinicas = resp.clinicas.length;
          return resp.clinicas;
         }),
         catchError( err => {
          swal('Error al buscar clínica', err.error.mensaje, 'error');
          return throwError(err);
        })
      );
  }
  borrarClinica( id: string) {
    let url = URL_SERVICIOS + '/clinica/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Clínica borrada', 'La clínica ha sido eliminado correctamente', 'success');
        return true;
      }),
      catchError( err => {
       swal('Error al borrar clínica', err.error.mensaje, 'error');
       return throwError(err);
     })
    );
  }
}
