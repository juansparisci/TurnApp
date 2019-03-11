import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClinicaService, UsuarioService, ProfesionService } from '../../services/service.index';
import { Clinica } from '../../models/clinica.model';
import { DatosContacto } from '../../models/datos-contacto.model';

import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Profesion } from '../../models/profesion';
import { Especialidad } from '../../models/especialidad';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clinica',
  templateUrl: './clinica.component.html',
  styles: []
})
export class ClinicaComponent implements OnInit {
   clinica: Clinica = new Clinica('', '', '');
   datosContacto: DatosContacto = new DatosContacto({principal: '', whatsapp: '' } , '', '');
   profesiones: Profesion[] = [];
  constructor(
               private _clinicaService: ClinicaService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private _modalUploadService: ModalUploadService,
               private _usuarioService: UsuarioService,
               private _profesionService: ProfesionService
              ) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];
                  if ( id !== 'nueva') {
                    this.cargarClinica(id);
                    this.cargarListaProfesiones();
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
  editarSitio() {
    window.open(this.clinica.urlId + 'edit/' + this._usuarioService.token);
  }
  cargarListaProfesiones() {
    this._profesionService.cargarProfesiones().subscribe(profs =>
      this.profesiones = profs
          );
  }
  CambioProfesion( profesion: string ) {
    const profEncontrada = this.findProfesionById(profesion);
    if (!profEncontrada) {
      this._clinicaService.vincularDesvincularProfesion(this.clinica._id, profesion).subscribe(ret => {
              if (ret.ok) {
                this.clinica.profesiones.push({_id: ret.idProfesionAsignada, profesion: profesion});
              }
      });
      }else {
      if ( profEncontrada.especialidadesAsignadas && profEncontrada.especialidadesAsignadas.length > 0 ) {
        swal( {
          title: 'Desvincule las especialidades de la profesión.',
          text: 'Para poder desvincular la profesión (' + this.profesionPorId(profEncontrada.profesion).nombre
          + '), primero debe desvincular las especialidades.',
          icon: 'info',
          buttons: ['Ok'],
          dangerMode: false,
        });
      }else {
        this._clinicaService.vincularDesvincularProfesion(this.clinica._id, profesion).subscribe(ret => {
          if (ret.ok) {
      this.clinica.profesiones.splice(this.clinica.profesiones.indexOf(profEncontrada), 1);
          }
  });
    }
    }
  }
  ProfesionAsignada(id: string): boolean {
    return this.findProfesionById(id) !== undefined;
  }
  CambioEspecialidad( especialidad: string, profesion: string ) {
    const espEncontrada = this.findEspecialidadById(especialidad);
    const profEncontrada = this.findProfesionById(profesion);
    if (!espEncontrada) {
      if ( !profEncontrada.especialidadesAsignadas ) {
        profEncontrada.especialidadesAsignadas = [];
      }
      this._clinicaService.vincularDesvincularEspecialidad(this.clinica._id, profesion, especialidad).subscribe(ret => {
        if (ret.ok) {
          profEncontrada.especialidadesAsignadas.push({ _id: ret.idEspecialidadAsignada, especialidad: especialidad});
        }
});
    }else {

      swal( {
        title: 'Está a punto de desvincular la especialidad ¿Estás seguro?',
        text: 'Si desvincula la especialidad se eliminaran las imagenes y descripciones asociadas a la misma. '
        + ' Una vez eliminada no podrá recuperarse.',
        icon: 'warning',
        buttons: ['Cancel', 'Ok'],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this._clinicaService.vincularDesvincularEspecialidad(this.clinica._id, profesion, especialidad).subscribe(ret => {
            if (ret.ok) {
              profEncontrada.especialidadesAsignadas.splice(profEncontrada.especialidadesAsignadas.indexOf(espEncontrada), 1);
            }
    });
        }
      });
}
  }
  EspecialidadAsignada(id: string): boolean {
    return this.findEspecialidadById(id) !== undefined;
  }

  public  findProfesionById(id: string): any {
    if (this.clinica.profesiones && this.clinica.profesiones.length > 0 && this.clinica.profesiones.find(p => p.profesion === id)) {
    return this.clinica.profesiones.find(p => p.profesion === id);
  }
    return undefined;
 }
 public  findEspecialidadById(id: string): any {
   let ret;
  if (this.clinica.profesiones && this.clinica.profesiones.length > 0) {
    try {
  /* return this.clinica.profesiones.map(p =>
                                    p.especialidadesAsignadas).reduce((a, b) => a.concat(b))
                            .find(e => e.especialidad._id === id);*/
                            this.clinica.profesiones.forEach(p => {
                              if ( p.especialidadesAsignadas && p.especialidadesAsignadas.length > 0) {
                                  p.especialidadesAsignadas.forEach(e => {
                                    if ( e.especialidad === id) {
                                          ret = e;
                                    }
                                  });
                              }
                            });
          }catch {
      return ret;
    }
  }
                          return ret;
 }

 public profesionPorId(id: string): Profesion {
     return this.profesiones.find(p => p._id === id);
 }
public EditarEspecialidadAsignada(idProfesion: string, idEspecialidad: string) {
  const idClinica = this.clinica._id;
  const idProfAsig  = this.findProfesionById(idProfesion)._id;
  const idEspAsig = this.findEspecialidadById(idEspecialidad)._id;
   this.router.navigate(['clinica', 'especialidad', idClinica, idProfAsig, idEspAsig]);
}
}
