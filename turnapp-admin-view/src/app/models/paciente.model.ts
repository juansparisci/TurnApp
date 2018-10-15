export class Paciente {
    constructor(
        public nombre?: string,
        public img?: string,
        public usuario?: string,
        public documento?: { tipo: string, numero?: number  },
        public datosContacto?: {
            telefono: string,
            email: string
        },
        public fechaNacimiento?: Date,
        public genero?: string,
        public ocupacion?: string,
        public _id?: string
    ) { }
}
