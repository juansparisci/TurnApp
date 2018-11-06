import { Component, OnInit } from '@angular/core';
import { ClinicaService } from '../../services/service.index';
import { Clinica } from '../../models/clinica.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;
@Component({
  selector: 'app-clinicas',
  templateUrl: './clinicas.component.html',
  styles: []
})
export class ClinicasComponent implements OnInit {
  clinicas: Clinica[] = [];
  cargando: boolean = false;
  constructor(
    public _clinicasService: ClinicaService,
    private _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarClinicas();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarClinicas());
  }
  buscarClinica( termino: string ) {
    if (termino.length === 0) {
      this.cargarClinicas();
      return;
    }
    this.cargando = true;
    this._clinicasService.buscarClinicas( termino )
      .subscribe(
        ( clinicas: Clinica[] ) => {
          this.clinicas = clinicas;
          this.cargando = false;
        }
      );

  }

  cargarClinicas() {
    this.cargando = true;
    this._clinicasService.cargarClinicas()
      .subscribe( (resp: Clinica[]) => {
        this.clinicas = resp;
        this.cargando = false;
      });
  }
  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal( 'clinicas', id);
  }
}
