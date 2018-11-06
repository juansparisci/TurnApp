import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClinicaService } from '../../services/service.index';
import { Clinica } from '../../models/clinica.model';
import { DatosContacto } from '../../models/datos-contacto.model';

import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-clinica',
  templateUrl: './clinica.component.html',
  styles: []
})
export class ClinicaComponent implements OnInit {
   clinica: Clinica = new Clinica('', '', '');
   datosContacto: DatosContacto = new DatosContacto({principal: '' } , '');
  constructor(
               private _clinicaService: ClinicaService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private _modalUploadService: ModalUploadService
              ) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];
                  if ( id !== 'nueva') {
                    this.cargarClinica(id);
                  }
                });
              }

  ngOnInit() {
      this._modalUploadService.notificacion
        .subscribe( (resp) => {
          this.clinica.img = resp.clinica.img;
        } );
  }
  guardarClinica(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.clinica.datosContacto = this.datosContacto;
    ((this.clinica._id) ?
    this._clinicaService.actualizarClinica( this.clinica )
    : this._clinicaService.guardarClinica( this.clinica ))
    .subscribe( cli => {
      this.clinica._id = cli._id;
      this.router.navigate(['clinica', cli._id]);
    }
    );
  }
  cargarClinica( id: string ) {
    this._clinicaService.obtenerClinica( id )
      .subscribe( (clinica: any) => {
          this.clinica = clinica.clinica;
          if (this.clinica.datosContacto) {
            this.datosContacto = this.clinica.datosContacto;
          }
        } );
  }
  cambiarFoto() {
    this._modalUploadService.mostrarModal('clinicas', this.clinica._id);
  }
  eliminarClinica( id: string) {

    if (!id) {
      return;
    }
    swal( {
      title: '¿Estás seguro?',
      text: 'Una vez eliminada la clínica, la misma no podrá recuperarse.',
      icon: 'warning',
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._clinicaService.borrarClinica( id )
      .subscribe( ( resp: any ) => {
        if ( resp ) {
          swal('La clíca se ha eliminado con éxito', {
            icon: 'success',
          }).then(
            () => this.router.navigate(['clinicas'])
          );
        }
      });
      }
    });
  }
}
