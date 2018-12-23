import { Component } from '@angular/core';
import { Clinica } from './models/clinica.model';
import { ClinicaService } from './services/clinica/clinica.service';
import { URL_ADMINPANEL } from './config/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  clinica: Clinica = new Clinica('');
  title = 'app';
  constructor(public _clinicaService: ClinicaService,
              public _location: Location) {
               const url = location.href;
               let urlId = url.replace('https', '').replace('http', '')
               .replace('www', '').replace('.com', '').replace('.ar', '')
               .replace('.', '').replace(/\//g, '').replace(/\:/g, '');
                if (_location.isCurrentPathEqualTo('/login') ) {
                  urlId = urlId.replace('login', '');
                  location.href = URL_ADMINPANEL + '/' + urlId + '/' + 'login';
                }
               this._clinicaService.obtenerClinicaPorUrl(urlId).subscribe((cli: any) => {
                  this.clinica = cli.clinica;
                 });
    }
}

