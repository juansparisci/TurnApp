import { Especialidad } from './especialidad';

export class Profesion {
    constructor (
    public nombre: string,
    public _id?: string,
    public activo?: boolean,
    public especialidades?: [Especialidad]
    ) { }
}
