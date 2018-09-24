import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { ObraSocial } from '../../models/obra-social';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  totalObrasSociales: number;
  constructor( private http: HttpClient,
              private _usuarioService: UsuarioService ) { }

              cargarObrasSociales() {
                const url = URL_SERVICIOS + '/obra-social/';
                return this.http.get(url).pipe(
                  map( (resp: any) => {
                      this.totalObrasSociales = resp.total;
                      return resp.obrassociales;
                  })
                );
              }
              buscarObrasSociales( termino: string ) {
                const url = URL_SERVICIOS + '/busqueda/coleccion/obrasSociales/' + termino;
                return this.http.get( url )
                  .pipe(
                    map((resp: any) => {
                      this.totalObrasSociales = resp.obrasSociales.length;
                      return resp.obrasSociales; })
                  );
              }
              borrarObraSocial( id: string ) {
                let url = URL_SERVICIOS + '/obra-social/' + id;
                url += '?token=' + this._usuarioService.token;
                return this.http.delete(url).pipe(
                  map(resp => {
                    swal('Obra Social borrada', 'La obra social ha sido eliminada correctamente', 'success');
                    return true;
                  })
                );
              }
              guardarObraSocial( obraSocial: ObraSocial) {
                let url = URL_SERVICIOS + '/obra-social';
                if ( obraSocial._id ) {
                  url += '/' + obraSocial._id;
                  url += '?token=' + this._usuarioService.token;
                  return this.http.put( url, obraSocial )
                    .pipe(
                      map((resp: any) => {
                        swal('Obra Social actualizada', obraSocial.nombre, 'success');
                        return resp.obraSocial;
                      })
                    );
                } else {
                  url += '?token=' + this._usuarioService.token;
                  return this.http.post( url , obraSocial)
                  .pipe(
                    map( (resp: any) => {
                      swal('Obra Social creada', obraSocial.nombre, 'success');
                      return resp.obraSocial;
                    })
                  );
                }
              }
              cargarObraSocial( id: string ) {
                const url = URL_SERVICIOS + '/obra-social/' + id;
                return this.http.get(url)
                .pipe(
                  map( (resp: any) => resp.obraSocial
                  )
                );
              }
              agregarPlan(idObraSocial: string, nombrePlan: string) {
                let url = URL_SERVICIOS + '/obra-social/plan';
                url += '/' + idObraSocial;
                  url += '?token=' + this._usuarioService.token;
                  return this.http.post( url, { nombre: nombrePlan } )
                    .pipe(
                      map((resp: any) => {
                        swal('Plan agregado', nombrePlan, 'success');
                        return resp.plan;
                      })
                    );
              }
              borrarPlan( idOS: string, idPlan: string ) {
                let url = URL_SERVICIOS + '/obra-social/plan/' + idOS + '/' + idPlan;
                url += '?token=' + this._usuarioService.token;
                return this.http.delete(url).pipe(
                  map(resp => {
                    swal('Plan eliminado', 'El Plan ha sido eliminado correctamente', 'success');
                    return true;
                  })
                );
              }
}
