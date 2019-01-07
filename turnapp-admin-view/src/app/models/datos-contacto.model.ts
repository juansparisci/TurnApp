export class DatosContacto {

    constructor(
        public telefonos: {
            principal: string,
            whatsapp: string
        },
        public facebook: string,
        public email: string
    ) {}
}
