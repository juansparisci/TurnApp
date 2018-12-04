import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS, ID_EMPRESA } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs';
import swal from 'sweetalert';
import { Clinica } from '../../models/clinica.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  clinica: Clinica;
  menu: any[] = [];
  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
     this.cargarStorage();
  }
  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get( url ).pipe(
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token );
        return true;
      }),
      catchError( err => {
        swal('No se pudo renovar el token', 'No fue posible renovar token', 'error');
        this.router.navigate(['/login']);
        return throwError(err);
      })
    );
  }
  estaLogueado() {
    return ( this.token.length > 5 );
  }

  //#region localStorage
  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.clinica = JSON.parse(localStorage.getItem('clinica'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }else {
      this.token = '';
      this.usuario = null;
      this.clinica = null;
      this.menu = null;
    }
  }
  guardarStorage(id: string, token: string, usuario: Usuario, menu: any, clinica: Clinica) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('clinica', JSON.stringify(clinica) );
    localStorage.setItem('menu', JSON.stringify(menu) );
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }
  //#endregion

  //#region logins/logout
  loginGoogle(token: string, clinica: Clinica) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post( url, { token }).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu, clinica);
        return true;
      })
    );
  }
  login(usuario: Usuario, recordar: boolean = false, clinica: Clinica) {
    if (recordar) {
      localStorage.setItem('email', usuario.email );
    }else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario)
    .pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu, clinica);
        return true;
      }),
      catchError( err => {
        swal('Error en Login', err.error.mensaje, 'error');
        return throwError(err);
      })
    );
  }
  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    localStorage.removeItem('clinica');
    this.router.navigate([this.clinica.urlId, 'login']);
  }
  //#endregion

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario ).pipe(
    map( (resp: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    }),
    catchError( err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    })
  );
  }
  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario).pipe(
      map( (resp: any) => {
        if (usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario, resp.menu, this.clinica);
        }
        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
      }),
      catchError( err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }
  cambiarImagen( file: File, idUsuario: string) {
    this._subirArchivoService.subirArchivo(file, 'usuarios', idUsuario)
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal( 'Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(idUsuario, this.token, this.usuario, this.menu, this.clinica);
    })
    .catch( resp => {
      console.log(resp);
    });
  }
  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }
  buscarUsuarios( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url )
      .pipe(
        map((resp: any) => resp.usuarios )
      );
  }
  borrarUsuario( id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
}
