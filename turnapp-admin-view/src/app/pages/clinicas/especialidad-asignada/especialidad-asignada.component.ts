import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EspecialidadAsignada } from '../../../models/especialidadAsignada';
import { ClinicaService } from '../../../services/service.index';
import { Clinica } from '../../../models/clinica.model';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-especialidad-asignada',
  templateUrl: './especialidad-asignada.component.html',
  styles: []
})
export class EspecialidadAsignadaComponent implements OnInit {
  public idClinica: string;
  private idProfesionAsignada: string;
  private idEspecialidadAsignada: string;
  especialidadAsignada: EspecialidadAsignada;
  constructor(  private activatedRoute: ActivatedRoute,
                private _clinicaService: ClinicaService,
                private _modalUploadService: ModalUploadService ) {
    activatedRoute.params.subscribe( params => {
      this.idClinica = params['idClinica'];
      this.idProfesionAsignada = params['idProfesion'];
      this.idEspecialidadAsignada = params['idEspecialidad'];
      _clinicaService.obtenerEspecialidadAsignada(this.idClinica, this.idProfesionAsignada, this.idEspecialidadAsignada)
                    .subscribe((ret: any) => {
         this.especialidadAsignada = ret.especialidadAsignada;
      });
    });
  }

  ngOnInit() {
    this._modalUploadService.notificacion
    .subscribe( (resp) => {
      this.especialidadAsignada.imgs.push(resp.img);
    } );
  }


  public guardarEspecialidad(f: any) {
    if (f.invalid) {
      return;
    }
    this._clinicaService.actualizarEspecialidadAsignada(this.idClinica,
                                              this.idProfesionAsignada, this.especialidadAsignada)
    .subscribe( esp => {
      console.log(esp);
    }
    );
  }
  public agregarImagen() {
    this._modalUploadService.mostrarModal('especialidades', this.idClinica + '|' + this.idProfesionAsignada
    + '|' + this.idEspecialidadAsignada );
  }
  public eliminarImagen(nombreImagen: string) {

    swal( {
      title: '¿Estás seguro?',
      text: 'Una vez eliminada la imagen, la misma no podrá recuperarse.',
      icon: 'warning',
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._clinicaService.eliminarImagenEspecialidad( nombreImagen, this.idClinica,
          this.idProfesionAsignada, this.idEspecialidadAsignada )
      .subscribe( ( resp: any ) => {
        if ( resp ) {
          swal('La imagen se ha eliminado con éxito', {
            icon: 'success',
          }).then(
            () => this.especialidadAsignada.imgs.splice(this.especialidadAsignada.imgs.indexOf(nombreImagen), 1)
          );
        }
      });
      }
    });

  }
}
