import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Clinica } from '../../models/clinica.model';
import { ClinicaService, ProfesionalService, ProfesionService } from '../../services/service.index';
import { Profesional } from '../../models/profesional.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Profesion } from '../../models/profesion';

@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styles: []
})
export class ProfesionalComponent implements OnInit {
   clinicas: Clinica[] = [];
   profesiones: Profesion[] = [];
   profesional: Profesional = new Profesional('', '', '', '', '', '');
   clinica: Clinica = new Clinica('');
   profesion: Profesion = new Profesion('');
  constructor(
               private _profesionalService: ProfesionalService,
               private _clinicaService: ClinicaService,
               private _profesionService: ProfesionService,
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
      this._profesionService.cargarProfesiones()
        .subscribe( profesiones => {
          this.profesiones = profesiones;
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
  cambioProfesion( id: string ) {
    this._profesionService.cargarProfesion(id).subscribe(
      (resp: any) => {
        this.profesion = resp;
        this.profesional.especialidades = [''];
      }
    );
  }
  CambioEspecialidad( id: string ) {
    const indexEspecialidad = this.profesional.especialidades.indexOf(id);
    if (indexEspecialidad === -1) {
        this.profesional.especialidades.push(id);
    }else {
      this.profesional.especialidades.splice(indexEspecialidad, 1);
    }
  }
  cargarProfesional( id: string ) {
    this._profesionalService.cargarProfesional( id )
      .subscribe( (profesional: any) => {
          this.profesional = profesional;
          this.clinica = profesional.clinica;
          this.profesion = profesional.profesion;
          this.profesional.clinica = profesional.clinica._id;
          this.profesional.profesion = profesional.profesion._id;
        } );
  }
  cambiarFoto() {
    this._modalUploadService.mostrarModal('profesionales', this.profesional._id);
  }
}
