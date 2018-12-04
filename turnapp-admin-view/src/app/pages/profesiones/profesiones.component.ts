import { Component, OnInit } from '@angular/core';
import { Profesion } from '../../models/profesion';

import { ProfesionService } from '../../services/service.index';

@Component({
  selector: 'app-profesiones',
  templateUrl: './profesiones.component.html',
  styles: []
})
export class ProfesionesComponent implements OnInit {
  profesiones: Profesion[] = [];
  constructor( public _profesionesService: ProfesionService) { }

  ngOnInit() {
    this.cargarProfesiones();
  }
  cargarProfesiones() {
    this._profesionesService.cargarProfesiones().subscribe(
      (resp: any) => {
        console.log(resp);
        this.profesiones = resp;
      }
    );
  }
  borrarProfesion( profesion: Profesion ) {
    this._profesionesService.borrarProfesion(profesion._id)
      .subscribe(() => this.cargarProfesiones());
  }
}
