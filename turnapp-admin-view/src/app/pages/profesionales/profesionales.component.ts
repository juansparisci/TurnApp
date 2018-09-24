import { Component, OnInit } from '@angular/core';
import { Profesional } from '../../models/profesional.model';
import { ProfesionalService } from '../../services/service.index';

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styles: []
})
export class ProfesionalesComponent implements OnInit {
  totalRegistros: number = 0;
  profesionales: Profesional[] = [];
  constructor (
    public _profesionalService: ProfesionalService
  ) { }

  ngOnInit() {
    this.cargarProfesionales();
  }
  cargarProfesionales() {
    this._profesionalService.cargarProfesionales().subscribe(
      (resp: any) => {
        this.profesionales = resp;
      }
    );
  }
  buscarProfesional( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarProfesionales();
      return;
    }
    this._profesionalService.buscarProfesionales( termino )
      .subscribe(
        (resp: any) => {
          this.profesionales = resp;
        }
      );
  }
  borrarProfesional( profesional: Profesional ) {
    this._profesionalService.borrarProfesional(profesional._id)
      .subscribe(() => this.cargarProfesionales());
  }
}
