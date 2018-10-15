import { Component, OnInit } from '@angular/core';
import { OcupacionService } from '../../services/service.index';
import { Ocupacion } from '../../models/ocupacion.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;
@Component({
  selector: 'app-ocupaciones',
  templateUrl: './ocupaciones.component.html',
  styles: []
})
export class OcupacionesComponent implements OnInit {
  ocupaciones: Ocupacion[] = [];
  cargando: boolean = false;
  constructor(
    public _ocupacionesService: OcupacionService,
    private _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarOcupaciones();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarOcupaciones());
  }
  buscarOcupaciones( termino: string ) {
    if (termino.length === 0) {
      this.cargarOcupaciones();
      return;
    }
    this.cargando = true;
    this._ocupacionesService.buscarOcupaciones( termino )
      .subscribe(
        ( ocupaciones: Ocupacion[] ) => {
          this.ocupaciones = ocupaciones;
          this.cargando = false;
        }
      );

  }
  crearOcupacion () {
    swal({
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Ingrese el nombre de la clínica',
          type: 'text',
        },
      },
    }).then( nombre => {
      if (nombre) {
        this._ocupacionesService.crearOcupacion(new Ocupacion(nombre))
        .subscribe( (resp: any ) => {
          this.cargarOcupaciones();
        });
      }
    }
  );
  }
  cargarOcupaciones() {
    this.cargando = true;
    this._ocupacionesService.cargarOcupaciones()
      .subscribe( (resp: Ocupacion[]) => {
        this.ocupaciones = resp;
        this.cargando = false;
      });
  }
  guardarOcupacion( ocupacion: Ocupacion) {
    this._ocupacionesService.actualizarOcupacion( ocupacion ).subscribe();
  }
  borrarOcupacion( ocupacion: Ocupacion) {
    if (!ocupacion) {
      return;
    }
    this._ocupacionesService.borrarOcupacion( ocupacion._id )
      .subscribe( ( resp: any ) => {
        if ( resp ) {
          this.cargarOcupaciones();
        }
      });
  }
}

