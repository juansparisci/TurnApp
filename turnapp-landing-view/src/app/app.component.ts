import { Component, OnInit } from '@angular/core';
import { Clinica } from './models/clinica.model';
import { ClinicaService } from './services/clinica/clinica.service';
import { URL_ADMINPANEL } from './config/config';
import { Location } from '@angular/common';
import { ModalUploadService } from './components/modal-upload/modal-upload.service';
import swal from 'sweetalert2';
import { HelperService } from './services/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  clinica: Clinica = new Clinica('');
  title = 'app';
  edit = false;
  token = '';
  constructor(public _clinicaService: ClinicaService,
              public _location: Location,
              public _modalUploadService: ModalUploadService,
              public helperService: HelperService) {
               let url = location.href;

               // me fijo si es edición
               const paths = location.pathname.split('/');
               const editIndex = paths.findIndex( (e) => e === 'edit');
               if ( editIndex > -1 ) {
                 this.edit = true;
                 this.token = paths[editIndex + 1];
                 url = url.substr(0, url.indexOf('edit'));
               }


               let urlId = encodeURIComponent(url); // url.replace('https', '').replace('http', '')
             //  .replace('www', '').replace('.com', '').replace('.ar', '')
           //    .replace('.', '').replace(/\//g, '').replace(/\:/g, '');
                if (_location.isCurrentPathEqualTo('/login') ) {
                  urlId = urlId.replace('login', '');
                  location.href = URL_ADMINPANEL + '/' + urlId + '/' + 'login';
                }
                               this._clinicaService.obtenerClinicaPorUrl(urlId).subscribe((cli: any) => {
                  this.clinica = cli.clinica;
                 });
    }
    ngOnInit() {
      this._modalUploadService.notificacion
        .subscribe( (resp) => {
          this.clinica.img = resp.clinica.img;
        } );
  }
    clickLogo() {
          this._modalUploadService.mostrarModal('clinicas', this.clinica._id, this.token);
    }
    textEditModal( property: string) {
      const clin = this.clinica;
      swal({
        title: 'Ingrese el eslogan',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !swal.isLoading(),
      }).then((result) => {
        if ( result.value ) {
       this.helperService.SetValueByPropertyString(property, result.value, clin);
        }
      });
    }
}

