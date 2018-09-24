import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuario'): any {
    let url = URL_SERVICIOS + '/img';
    if (!img) {
      return url + '/usuarios/xxx';
    }
    // Si es de google (comienza con https) devuelvo la ruta completa como se recibe
    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    switch (tipo) {
    case 'usuario':
        url += '/usuarios/' + img;
    break;

    case 'profesional':
        url += '/profesionales/' + img;
    break;

    case 'clinica':
        url += '/clinicas/' + img;
    break;
    case 'obraSocial':
    url += '/obras-sociales/' + img;
    break;
    case 'paciente':
    url += '/pacientes/' + img;
    break;
    default:
    console.log('Tipo de imagen inexistente. Solo se permite usuarios, profesionales, clinicas, obras sociales, pacientes.');
      url += '/usuarios/xxx';
    }
    return url;
  }

}
