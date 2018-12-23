import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}
  canActivate(): Promise<boolean> | boolean {
    console.log('tokenGuard');
    const token = this._usuarioService.token;
        const payload = JSON.parse( atob(token.split('.')[1]) );
        const expirado = this.expirado(payload.exp);
        if (expirado) {
          this.router.navigate(['/' + this._usuarioService.clinica.urlId, 'login']);
          return false;
        } else {
         return this.verificaRenueva(payload.exp);
        }

  }
  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {
        const tokenExp = new Date(fechaExp * 1000);
        const ahora = new Date();
        ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000)); // Ahora más 4 horas
        if ( tokenExp.getTime() > ahora.getTime() ) {
          resolve(true);
        } else {
          this._usuarioService.renuevaToken()
            .subscribe( () => {
              resolve(true);
            }, () => {
              this.router.navigate(['/login']);
              reject(false);
            });
        }
    });
  }
  expirado(fechaExp: number) {
  const ahora = new Date().getTime() / 1000;
  if (fechaExp < ahora) {
    return true;
  }else {
    return false;
  }
  }
}
