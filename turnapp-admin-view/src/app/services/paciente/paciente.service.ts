import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Paciente } from '../../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  public totalPacientes: number = 0;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }
  cargarPacientes() {
    const url = URL_SERVICIOS + '/paciente/';
    return this.http.get(url).pipe(
      map( (resp: any) => {
          this.totalPacientes = resp.total;
          return resp.pacientes;
      })
    );
  }
  buscarPacientes( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/pacientes/' + termino;
    return this.http.get( url )
      .pipe(
        map((resp: any) => {
          this.totalPacientes = resp.pacientes.length;
          return resp.pacientes; })
      );
  }
  borrarPaciente( id: string ) {
    let url = URL_SERVICIOS + '/paciente/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Paciente borrado', 'El paciente ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
  guardarPaciente( paciente: Paciente) {
    let url = URL_SERVICIOS + '/paciente';
    if ( paciente._id ) {
      url += '/' + paciente._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, paciente )
        .pipe(
          map((resp: any) => {
            swal('Paciente actualizado', paciente.nombre, 'success');
            return resp.paciente;
          })
        );
    } else {
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url , paciente)
      .pipe(
        map( (resp: any) => {
          swal('Paciente creado', paciente.nombre, 'success');
          return resp.paciente;
        })
      );

    }

  }
  cargarPaciente( id: string ) {
    const url = URL_SERVICIOS + '/paciente/' + id;
    return this.http.get(url)
    .pipe(
      map( (resp: any) => resp.paciente
      )
    );
  }
}
