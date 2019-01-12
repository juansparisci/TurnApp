import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_ADMINPANEL } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Clinica } from '../../models/clinica.model';
import swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  obtenerClinica( id: string ) {
    const url = URL_SERVICIOS + '/clinica/' + id;
    return this.http.get(url);
  }
  obtenerClinicaPorUrl( pUrl: string ) {
    const url = URL_SERVICIOS + '/clinica/url/' + pUrl;
    return this.http.get(url);
  }
  actualizarSitioClinica(clinica: Clinica, token: string) {
    let url = URL_SERVICIOS + '/clinica/sitio/' + clinica._id;
    url += '?token=' + token;
    return this.http.put( url, clinica).pipe(
      map( (resp: any) => {
        swal('Clinica actualizada', clinica.nombre, 'success');
        return clinica;
      }),
      catchError( err => {
       swal('Error al actualizar clínica', err.error.mensaje, 'error');
       if (err.status === 401) {
        swal('Sesión vencida. Por favor vuelva a iniciar sesión.');
        location.href = URL_ADMINPANEL + '/' + encodeURIComponent(clinica.urlId) + '/' + 'login';
       }
       return throwError(err);
     })
    );
  }
}
