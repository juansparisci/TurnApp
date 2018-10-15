import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Ocupacion } from '../../models/ocupacion.model';
import { UsuarioService } from '../usuario/usuario.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcupacionService {
  public totalOcupaciones: number = 0;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }
  cargarOcupaciones() {
    const url = URL_SERVICIOS + '/ocupacion';
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalOcupaciones = resp.ocupaciones.length;
        return resp.ocupaciones;
       })
    );
  }
  obtenerOcupacion( id: string ) {
    const url = URL_SERVICIOS + '/ocupacion/' + id;
    return this.http.get(url);
  }
  crearOcupacion( ocupacion: Ocupacion ) {
    let url = URL_SERVICIOS + '/ocupacion/';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, ocupacion ).pipe(
    map( (resp: any) => {
      swal('Ocupación creada', ocupacion.nombre, 'success');
      return resp.ocupacion;
    })
  );
  }
  actualizarOcupacion(ocupacion: Ocupacion) {
    let url = URL_SERVICIOS + '/ocupacion/' + ocupacion._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, ocupacion).pipe(
      map( (resp: any) => {
        swal('Ocupación actualizada', ocupacion.nombre, 'success');
        return true;
      })
    );
  }
  buscarOcupaciones( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/ocupaciones/' + termino;
    return this.http.get( url )
      .pipe(
        map((resp: any) => {
          this.totalOcupaciones = resp.ocupaciones.length;
          return resp.ocupaciones;
         })
      );
  }
  borrarOcupacion( id: string) {
    let url = URL_SERVICIOS + '/ocupacion/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Ocupación borrada', 'La ocupación ha sido eliminado correctamente', 'success');
        return true;
      }),
      catchError( err => {
       swal('No puede borrar la ocupación', err.error.mensaje, 'error');
       return throwError(err);
     })
    );
  }
}
