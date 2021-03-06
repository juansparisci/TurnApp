import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

import { NgZone } from '@angular/core'; // Se usa para resolver bug con el template adminpro
import { Clinica } from '../models/clinica.model';
import { ClinicaService } from '../services/clinica/clinica.service';
import { ImagenPipe } from '../pipes/imagen.pipe';
import { DEFAULT_URLID } from '../config/config';


declare function init_plugins();
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ImagenPipe]
})
export class LoginComponent implements OnInit {
  recuerdame: boolean= false;
  email: string;
  clinica: Clinica;
  auth2: any;
  constructor(public router: Router,
              public _usuarioService: UsuarioService,
              public _clinicaServie: ClinicaService,
              private zone: NgZone,
              private activatedRoute: ActivatedRoute,
              public imagen: ImagenPipe) {
                activatedRoute.params.subscribe( params => {
                  let urlClinica = DEFAULT_URLID;
                  if ( params['urlClinica']) {
                  urlClinica = encodeURIComponent(decodeURIComponent(params['urlClinica']));
                  }
                  _clinicaServie.obtenerClinicaPorUrl(urlClinica).subscribe((cli: any) => {
                       this.clinica = cli.clinica;
                      }
                     );

                });
               }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    this.recuerdame = (this.email.length > 0);
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '363985333109-328ghs1ekj7e8m8fti1hnlqq0t8snq6i.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email' // para acceder al calendario se debe configurar ademas la consola de google
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    } );
  }

  attachSignin( element) {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
    // const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;

    // se ejecuta dentro de una zona para controlar error con template admin pro
    this.zone.run( () => {
      this._usuarioService.loginGoogle( token, this.clinica )
      .subscribe( () => window.location.href = '/dashboard' // this.router.navigate(['/dashboard'])
      );
    });

    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login(usuario, forma.value.recuerdame, this.clinica)
    .subscribe(correcto => this.router.navigate(['/dashboard']));
  }

}
