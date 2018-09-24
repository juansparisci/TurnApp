import { Component, OnInit } from '@angular/core';
import { ObraSocial } from '../../models/obra-social';
import { ObraSocialService } from '../../services/service.index';

@Component({
  selector: 'app-obras-sociales',
  templateUrl: './obras-sociales.component.html',
  styles: []
})
export class ObrasSocialesComponent implements OnInit {
  obrasSociales: ObraSocial[] = [];
  constructor( public _obraSocialService: ObraSocialService) { }

  ngOnInit() {
    this.cargarObrasSociales();
  }
  cargarObrasSociales() {
    this._obraSocialService.cargarObrasSociales().subscribe(
      (resp: any) => {
        console.log(resp);
        this.obrasSociales = resp;
      }
    );
  }
  buscarObraSocial( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarObrasSociales();
      return;
    }
    this._obraSocialService.buscarObrasSociales( termino )
      .subscribe(
        (resp: any) => {
          this.obrasSociales = resp;
        }
      );
  }
  borrarObraSocial( obraSocial: ObraSocial ) {
    this._obraSocialService.borrarObraSocial(obraSocial._id)
      .subscribe(() => this.cargarObrasSociales());
  }
}
