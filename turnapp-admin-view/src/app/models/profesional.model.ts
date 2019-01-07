export class Profesional {

    constructor(
        public nombre?: string,
        public apellido?: string,
        public img?: string,
        public usuario?: string,
        public clinica?: string,
        public profesion?: string,
        public especialidades?: [string],
        public _id?: string,
        public cartaPresentacion?: string
    ) { }
}
