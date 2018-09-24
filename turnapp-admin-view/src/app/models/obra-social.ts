export class ObraSocial {
    constructor (
    public nombre: string,
    public img?: string,
    public _id?: string,
    public activo?: boolean,
    public planes?: [{
                     _id?: string,
                     nombre?: string
                     }]
    ) { }
}
