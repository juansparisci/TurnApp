import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class ProfGuard implements CanActivate {
  constructor ( private _usuarioService: UsuarioService ) {}
  canActivate(): boolean {
    if ( this._usuarioService.usuario.role === 'PROF_ROLE' ) {
      return true;
    } else {
      console.log('Bloqueado por el ProfGuard');
      this._usuarioService.logout();
      return false;
    }
  }
}
