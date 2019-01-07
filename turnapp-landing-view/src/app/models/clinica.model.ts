import { DatosContacto } from './datos-contacto.model';

export class Clinica {

    constructor (
        public nombre: string,
        public img?: string,
        public _id?: string,
        public urlId?: string,
        public sitioInstitucional?: {
                principal: {
                        eslogan: string,
                        descripcion: string,
                        imgPrincipal: string,
                        imgBGPrincipal: string,
                        items: [{
                                tituloItem: string,
                                descripcionItem: string
                        }]
                }
        },
        public datosContacto?: DatosContacto
    ) { }

}

