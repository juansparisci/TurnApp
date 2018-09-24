import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Clinica } from '../../models/clinica.model';
import { ClinicaService, ProfesionalService } from '../../services/service.index';
import { Profesional } from '../../models/profesional.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styles: []
})
export class ProfesionalComponent implements OnInit {
   clinicas: Clinica[] = [];
   profesional: Profesional = new Profesional('', '', '', '', '');
   clinica: Clinica = new Clinica('');
  constructor(
               private _profesionalService: ProfesionalService,
               private _clinicaService: ClinicaService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private _modalUploadService: ModalUploadService
              ) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];
                  if ( id !== 'nuevo') {
                    this.cargarProfesional(id);
                  }
                });
              }

  ngOnInit() {
    this._clinicaService.cargarClinicas()
      .subscribe( clinicas => {
        this.clinicas = clinicas;
      });
      this._modalUploadService.notificacion
        .subscribe( (resp) => {
          this.profesional.img = resp.profesional.img;
        } );
  }
  guardarProfesional(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this._profesionalService.guardarProfesional( this.profesional )
    .subscribe( prof => {
      this.profesional._id = prof._id;
      this.router.navigate(['profesional', prof._id]);
    }
    );
  }
  cambioClinica( id: string ) {
    this._clinicaService.obtenerClinica(id).subscribe(
      (resp: any) => {
        this.clinica = resp.clinica;
      }
    );
  }
  cargarProfesional( id: string ) {
    this._profesionalService.cargarProfesional( id )
      .subscribe( (profesional: any) => {
          this.profesional = profesional;
          this.clinica = profesional.clinica;
          this.profesional.clinica = profesional.clinica._id;
        } );
  }
  cambiarFoto() {
    this._modalUploadService.mostrarModal('profesionales', this.profesional._id);
  }
}
