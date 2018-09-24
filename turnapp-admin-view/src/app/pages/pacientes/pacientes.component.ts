import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../services/service.index';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styles: []
})
export class PacientesComponent implements OnInit {
  public pacientes: Paciente[];
  constructor( public _pacienteService: PacienteService) { }

  ngOnInit() {
    this.cargarPacientes();
  }
  cargarPacientes() {
    this._pacienteService.cargarPacientes().subscribe(
      (resp: any) => {
        this.pacientes = resp;
      }
    );
  }
  buscarProfesional( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarPacientes();
      return;
    }
    this._pacienteService.buscarPacientes( termino )
      .subscribe(
        (resp: any) => {
          this.pacientes = resp;
        }
      );
  }
  borrarProfesional( paciente: Paciente ) {
    this._pacienteService.borrarPaciente(paciente._id)
      .subscribe(() => this.cargarPacientes());
  }

}
