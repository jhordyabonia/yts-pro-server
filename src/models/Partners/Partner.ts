import { PartnerInterface } from "./PartnerInterface";

export class Partner implements PartnerInterface {
    _id?: string;
    nombre: string;
    email: string;
    channel_id: string;
    code: string;
    created_date?: Date;

    constructor(partner: PartnerInterface) {
        this._id = partner._id;
        this.nombre = partner.nombre;
        this.email = partner.email;
        this.channel_id = partner.channel_id;
        this.code = partner.code;
        this.created_date = partner.created_date;
    }

    static parser(data: any): Partner {
        return new Partner({
            _id: data._id,
            nombre: data.nombre,
            email: data.email,
            channel_id: data.channel_id,
            code: data.code,
            created_date: data.created_date
        });
    }

    static generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}