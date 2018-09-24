import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Paciente } from '../../models/paciente.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { PacienteService } from '../../services/paciente/paciente.service';


@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styles: []
})
export class PacienteComponent implements OnInit {
  paciente: Paciente = new Paciente('', '', '', '', { tipo: '', numero: null });
 constructor(
              private _pacienteService: PacienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _modalUploadService: ModalUploadService
             ) {
               activatedRoute.params.subscribe( params => {
                 const id = params['id'];
                 if ( id !== 'nuevo') {
                   this.cargarPaciente(id);
                 }
               });
             }

 ngOnInit() {
     this._modalUploadService.notificacion
       .subscribe( (resp) => {
         this.paciente.img = resp.paciente.img;
       } );
 }
 guardarPaciente(f: NgForm) {
   if (f.invalid) {
     return;
   }
   this._pacienteService.guardarPaciente( this.paciente )
   .subscribe( prof => {
     this.paciente._id = prof._id;
     this.router.navigate(['paciente', prof._id]);
   }
   );
 }
 cargarPaciente( id: string ) {
   this._pacienteService.cargarPaciente( id )
     .subscribe( (paciente: any) => {
         this.paciente = paciente;
       } );
 }
 cambiarFoto() {
   this._modalUploadService.mostrarModal('pacientes', this.paciente._id);
 }

}
