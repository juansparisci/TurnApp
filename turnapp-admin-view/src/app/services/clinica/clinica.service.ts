import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Clinica } from '../../models/clinica.model';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  public totalClinicas: number = 0;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }
  cargarClinicas() {
    const url = URL_SERVICIOS + '/clinica';
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalClinicas = resp.clinicas.length;
        return resp.clinicas;
       })
    );
  }
  obtenerClinica( id: string ) {
    const url = URL_SERVICIOS + '/clinica/' + id;
    return this.http.get(url);
  }
  crearClinica( clinica: Clinica ) {
    let url = URL_SERVICIOS + '/clinica/';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, clinica ).pipe(
    map( (resp: any) => {
      swal('Clinica creada', clinica.nombre, 'success');
      return resp.clinica;
    })
  );
  }
  actualizarClinica(clinica: Clinica) {
    let url = URL_SERVICIOS + '/clinica/' + clinica._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, clinica).pipe(
      map( (resp: any) => {
        swal('Clinica actualizada', clinica.nombre, 'success');
        return true;
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
      })
    );
  }
}
