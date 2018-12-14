import { Component, OnInit } from '@angular/core';
import { ObraSocial } from '../../models/obra-social';
import { ObraSocialService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-obra-social',
  templateUrl: './obra-social.component.html',
  styles: []
})
export class ObraSocialComponent implements OnInit {
   obraSocial: ObraSocial = new ObraSocial('', '', '', true);
  constructor(
               private _obraSocialService: ObraSocialService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private _modalUploadService: ModalUploadService
              ) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];
                  if ( id !== 'nuevo') {
                    this.cargarObraSocial(id);
                  }
                });
              }

  ngOnInit() {
      this._modalUploadService.notificacion
        .subscribe( (resp) => {
          this.obraSocial.img = resp.obraSocial.img;
        } );
  }
  guardarObraSocial(f: NgForm) {
    if (f.invalid) {
      return;
    }
    console.log(this.obraSocial);
    this._obraSocialService.guardarObraSocial( this.obraSocial )
    .subscribe( os => {
      this.obraSocial._id = os._id;
      this.router.navigate(['obra-social', os._id]);
    }
    );
  }
  cargarObraSocial( id: string ) {
    this._obraSocialService.cargarObraSocial( id )
      .subscribe( (os: any) => {
          this.obraSocial = os;
        } );
  }
  cambiarFoto() {
    this._modalUploadService.mostrarModal('obras-sociales', this.obraSocial._id);
  }
  agregarPlan() {
    swal({
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Ingrese el nombre del plan',
          type: 'text',
        },
      },
    }).then( nombre => {
      if (nombre) {
        this._obraSocialService.agregarPlan(this.obraSocial._id, nombre)
        .subscribe( (resp: any ) => {
          this.obraSocial.planes.push(resp);
        });
      }
    });
  }
  borrarPlan( idPlan: string ) {
    this._obraSocialService.borrarPlan(this.obraSocial._id, idPlan)
    .subscribe( (resp: any ) => {
     this.obraSocial.planes.splice( this.obraSocial.planes.findIndex(item => item._id === idPlan), 1);
    });
  }
}
