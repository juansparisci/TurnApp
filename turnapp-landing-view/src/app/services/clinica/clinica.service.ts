import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


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
}
