import { DatosContacto } from './datos-contacto.model';

export class Clinica {
    constructor (
        public nombre: string,
        public img?: string,
        public _id?: string,
        public urlId?: string,
        public datosContacto?: DatosContacto
    ) {
     }

}

