import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Profesion } from '../../models/profesion';
import { Especialidad } from '../../models/especialidad';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfesionService {
  totalProfesiones: number;
  constructor( private http: HttpClient,
              private _usuarioService: UsuarioService,
              private router: Router) { }

              cargarProfesiones() {
                const url = URL_SERVICIOS + '/profesion/';
                return this.http.get(url).pipe(
                  map( (resp: any) => {
                      this.totalProfesiones = resp.total;
                      return resp.profesiones;
                  })
                );
              }
              borrarProfesion( id: string ) {
                let url = URL_SERVICIOS + '/profesion/' + id;
                url += '?token=' + this._usuarioService.token;
                return this.http.delete(url).pipe(
                  map(resp => {
                    swal('Profesión borrada', 'La profesión ha sido eliminada correctamente', 'success');
                    return true;
                  })
                );
              }
              guardarProfesion( profesion: Profesion) {
                let url = URL_SERVICIOS + '/profesion';
                if ( profesion._id ) {
                  url += '/' + profesion._id;
                  url += '?token=' + this._usuarioService.token;
                  return this.http.put( url, profesion )
                    .pipe(
                      map((resp: any) => {
                        swal('Profesión actualizada', profesion.nombre, 'success');
                        return resp.profesion;
                      })
                    );
                } else {
                  url += '?token=' + this._usuarioService.token;
                  return this.http.post( url , profesion)
                  .pipe(
                    map( (resp: any) => {
                      swal('Profesión creada', profesion.nombre, 'success');
                      return resp.profesion;
                    })
                  );
                }
              }
              cargarProfesion( id: string ) {
                const url = URL_SERVICIOS + '/profesion/' + id;
                return this.http.get(url)
                .pipe(
                  map( (resp: any) => resp.profesion
                  )
                );
              }
              agregarEspecialidad(idProfesion: string, especialidad: Especialidad) {
                let url = URL_SERVICIOS + '/profesion/especialidad/' + idProfesion;
                if ( especialidad._id ) {
                  url += '/' + especialidad._id;
                  url += '?token=' + this._usuarioService.token;
                  return this.http.put( url, especialidad )
                    .pipe(
                      map((resp: any) => {
                        swal('Especialidad actualizada',  'success');
                        return resp.especialidad;
                      })
                    );
                } else {
                  url += '?token=' + this._usuarioService.token;
                  return this.http.post( url , especialidad)
                  .pipe(
                    map( (resp: any) => {
                      swal('Especialidad creada', especialidad.nombre, 'success');
                      return resp.especialidad;
                    })
                  );
                }
              }
              borrarEspecialidad( idProfesion: string, idEspecialidad: string ) {
                let url = URL_SERVICIOS + '/profesion/especialidad/' + idProfesion + '/' + idEspecialidad;
                url += '?token=' + this._usuarioService.token;
                return this.http.delete(url).pipe(
                  map(resp => {
                    swal('Especialidad eliminada', 'La Especialidad ha sido eliminada correctamente', 'success');
                    return true;
                  })
                );
              }
              cargarEspecialidad( idProfesion: string, idEspecialidad: string ) {
                let url = URL_SERVICIOS + '/profesion/especialidad/' + idProfesion + '/' + idEspecialidad;
                url += '?token=' + this._usuarioService.token;
                return this.http.get(url).pipe(
                  map( (resp: any) => {
                    return resp.especialidad;
                  }),
      catchError( err => {
       swal('Error al cargar la especialidad', err.error.mensaje, 'error');
       if (err.status === 401) {
        this.router.navigate(['/' + encodeURIComponent(this._usuarioService.clinica.urlId), 'login']);
       }
       return throwError(err);
     })
                );
              }
              eliminarImagenEspecialidad( nombreImagen: string, idProfesion: string, idEspecialidad: string ) {
                let url = URL_SERVICIOS + '/upload/especialidades/' + idProfesion + '|' + idEspecialidad + '/' + nombreImagen;
                url += '?token=' + this._usuarioService.token;
                return this.http.delete(url)
                .pipe(
                  map(resp => {
                    swal('Imagen eliminada', 'La Especialidad ha sido eliminada correctamente', 'success');
                    return true;
                  })
                )
                ;
              }
}
