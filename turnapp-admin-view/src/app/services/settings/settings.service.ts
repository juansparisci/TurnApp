import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class SettingsService {
  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };
  constructor(@Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
   }
  guardarAjustes() {
    // console.log('Guardando en localStorage');
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }
  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      // console.log('Cargando localstorage');
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
    }else {
      // console.log('Cargando valores por defecto');
    }
    this.aplicarTema(this.ajustes.tema);
  }
  aplicarTema(tema: string) {
    const url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('tema').setAttribute('href', url);
    if ( tema !== this.ajustes.tema ) {
      this.ajustes.tema = tema;
      this.ajustes.temaUrl = url;
      this.guardarAjustes();
    }
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
