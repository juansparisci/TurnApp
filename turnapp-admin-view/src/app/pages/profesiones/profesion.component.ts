import { Component, OnInit } from '@angular/core';
import { Profesion } from '../../models/profesion';
import { ProfesionService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profesion',
  templateUrl: './profesion.component.html',
  styles: []
})
export class ProfesionComponent implements OnInit {
   profesion: Profesion = new Profesion('', '', true);
  constructor(
               private _profesionService: ProfesionService,
               private router: Router,
               private activatedRoute: ActivatedRoute
              ) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];
                  if ( id !== 'nuevo') {
                    this.cargarProfesion(id);
                  }
                });
              }

  ngOnInit() {
  }
  guardarProfesion(f: NgForm) {
    if (f.invalid) {
      return;
    }
    console.log(this.profesion);
    this._profesionService.guardarProfesion( this.profesion )
    .subscribe( os => {
      this.profesion._id = os._id;
      this.router.navigate(['profesion', os._id]);
    }
    );
  }
  cargarProfesion( id: string ) {
    this._profesionService.cargarProfesion( id )
      .subscribe( (os: any) => {
          this.profesion = os;
        } );
  }
  agregarEspecialidad() {
    swal({
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Ingrese el nombre de la especialidad',
          type: 'text',
        },
      },
    }).then( nombre => {
      if (nombre) {
        this._profesionService.agregarEspecialidad(this.profesion._id, nombre)
        .subscribe( (resp: any ) => {
          this.profesion.especialidades.push(resp);
        });
      }
    });
  }
  borrarEspecialidad( idEspecialidad: string ) {
    this._profesionService.borrarEspecialidad(this.profesion._id, idEspecialidad)
    .subscribe( (resp: any ) => {
     this.profesion.especialidades.splice( this.profesion.especialidades.findIndex(item => item._id === idEspecialidad), 1);
    });
  }
}
