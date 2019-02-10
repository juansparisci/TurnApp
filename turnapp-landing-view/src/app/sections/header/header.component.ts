import { Component, OnInit, Input } from '@angular/core';
import { ClinicaService } from '../../services/clinica/clinica.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  @Input('token') token: string;
  constructor( public _clinicaService: ClinicaService,
               public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this._modalUploadService.notificacion
    .subscribe( (resp) => {
      this._clinicaService.clinica.img = resp.clinica.img;
    } );
  }
  guardarCambios() {
    this._clinicaService.actualizarSitioClinica(this.token).subscribe( (cli) => {
      this._clinicaService.hayCambios = false;
    });
  }
  descartarCambios() {
    this._clinicaService.obtenerClinicaPorUrl(encodeURIComponent(this._clinicaService.clinica.urlId));
  }
  clickLogo() {
    this._modalUploadService.mostrarModal('clinicas', this._clinicaService.clinica._id, this.token);
}
}
