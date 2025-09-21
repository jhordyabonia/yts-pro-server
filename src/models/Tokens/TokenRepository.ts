/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import { TokenInterface } from "./TokenInterface";
import { Token } from "./Token";
import { AbstractRepository } from "../AbstracRepository";

export class TokenRepository extends AbstractRepository {
    constructor () {
        super("tokens");
    }

    async post(token: TokenInterface) {
        const result = await this.collection.insertOne(token);
        return result.insertedId;
    }

    async get(id: string) {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return result ? Token.parser(result) : null;
    }

    async getAll(query: Partial<TokenInterface> = {}) {
        const cursor = this.collection.find(query);
        const results = await cursor.toArray();
        return results.map(doc => Token.parser(doc));
    }

    async put(id: string, token: Partial<TokenInterface>) {
        delete token._id
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: token }
        );
        return result.matchedCount === 1;
    }

    async delete(id: string) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    }

    async findByApiKey(apiKey: string) {
        const result = await this.collection.findOne({ api_key: apiKey });
        return result ? Token.parser(result) : null;
    }

}