export class Paciente {

    constructor(
        public nombre?: string,
        public img?: string,
        public usuario?: string,
        public telefono?: string,
        public documento?: { tipo: string, numero?: number  },
        public _id?: string
    ) { }
}
