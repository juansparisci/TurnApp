import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Profesional } from '../../models/profesional.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  public totalProfesionales: number = 0;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }
  cargarProfesionales() {
    const url = URL_SERVICIOS + '/profesional/';
    return this.http.get(url).pipe(
      map( (resp: any) => {
          this.totalProfesionales = resp.total;
          return resp.profesionales;
      })
    );
  }
  buscarProfesionales( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/profesionales/' + termino;
    return this.http.get( url )
      .pipe(
        map((resp: any) => {
          this.totalProfesionales = resp.profesionales.length;
          return resp.profesionales; })
      );
  }
  borrarProfesional( id: string ) {
    let url = URL_SERVICIOS + '/profesional/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Profesional borrado', 'El profesional ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
  guardarProfesional( profesional: Profesional) {
    let url = URL_SERVICIOS + '/profesional';
    if ( profesional._id ) {
      url += '/' + profesional._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, profesional )
        .pipe(
          map((resp: any) => {
            swal('Profesional actualizado', profesional.nombre, 'success');
            return resp.profesional;
          })
        );
    } else {
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url , profesional)
      .pipe(
        map( (resp: any) => {
          swal('Profesional creado', profesional.nombre, 'success');
          return resp.profesional;
        })
      );

    }

  }
  cargarProfesional( id: string ) {
    const url = URL_SERVICIOS + '/profesional/' + id;
    return this.http.get(url)
    .pipe(
      map( (resp: any) => resp.profesional
      )
    );
  }
}
