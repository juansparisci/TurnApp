import { Component, OnInit } from '@angular/core';
import { Especialidad } from '../../../models/especialidad';
import { ProfesionService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styles: []
})
export class EspecialidadComponent implements OnInit {
  especialidad: Especialidad  = new Especialidad('');
  idProfesion: string= '';
  idEspecialidad: string = '';
  constructor(private _profesionService: ProfesionService,
              private router: Router,
              private activatedRoute: ActivatedRoute ) {
                activatedRoute.params.subscribe( params => {
                  this.idProfesion = params['idProfesion'];
                  this.idEspecialidad = params['idEspecialidad'];
                  if (this.idEspecialidad !== 'nueva') {
                    this.cargarEspecialidad(this.idEspecialidad);
                  }
                });
               }

  ngOnInit() {
  }
  private cargarEspecialidad (idEsp: string) {
    this._profesionService.cargarEspecialidad( this.idProfesion, this.idEspecialidad )
    .subscribe( (esp: any) => {
        this.especialidad = esp;
      } );
  }
  public guardarEspecialidad(f: any) {
    if (f.invalid) {
      return;
    }
    this._profesionService.agregarEspecialidad( this.idProfesion, this.especialidad )
    .subscribe( esp => {
      this.especialidad = esp;
      this.idEspecialidad = esp._id;
    }
    );
  }
  public eliminarEspecialidad() {
    {

      if (!this.idProfesion || !this.idEspecialidad) {
        return;
      }
      swal( {
        title: '¿Estás seguro?',
        text: 'Una vez eliminada la especialidad, la misma no podrá recuperarse.',
        icon: 'warning',
        buttons: ['Cancel', 'Ok'],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this._profesionService.borrarEspecialidad( this.idProfesion, this.idEspecialidad )
        .subscribe( ( resp: any ) => {
          if ( resp ) {
            swal('La especialidad se ha eliminado con éxito', {
              icon: 'success',
            }).then(
              () => this.router.navigate(['profesion', this.idProfesion])
            );
          }
        });
        }
      });
    }
  }
}
