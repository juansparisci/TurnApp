import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Clinica } from '../../models/clinica.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
   usuario: Usuario;
   clinica: Clinica;
  constructor( public _usuarioService: UsuarioService,
  private router: Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this.clinica = this._usuarioService.clinica;
  }
buscar( termino: string ) {
this.router.navigate(['busqueda', termino] );
}
}
