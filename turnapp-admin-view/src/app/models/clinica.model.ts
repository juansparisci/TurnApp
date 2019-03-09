import { DatosContacto } from './datos-contacto.model';
import { Profesion } from './profesion';
import { Especialidad } from './especialidad';

export class Clinica {
    constructor (
        public nombre: string,
        public img?: string,
        public _id?: string,
        public urlId?: string,
        public datosContacto?: DatosContacto,
        public profesiones?: [{ _id: string,
                                profesion: string,
                                especialidadesAsignadas?: [{
                                especialidad: string,
                                descripcionPersonalizada: string,
                                imgs: [string]
            }],
        }]
    ) {
     }


}

