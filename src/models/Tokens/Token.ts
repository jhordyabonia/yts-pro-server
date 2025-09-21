import { TokenInterface } from "./TokenInterface";

export class Token implements TokenInterface {
    _id?: string;
    api_key: string;
    used: number;
    created_date?: Date;

    constructor(token: TokenInterface) {
        this._id = token._id;
        this.api_key = token.api_key;
        this.used = token.used;
        this.created_date = token.created_date;
    }

    static parser(data: any): Token {
        return new Token({
            _id: data._id,
            api_key: data.api_key,
            used: data.used,
            created_date: data.created_date
        });
    }
}