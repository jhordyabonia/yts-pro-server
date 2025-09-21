/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * @description: Partner Repository
 */
import { ObjectId } from "mongodb";
import { PartnerInterface } from "./PartnerInterface";
import { Partner } from "./Partner";
import { AbstractRepository } from "../AbstracRepository";

export class PartnerRepository extends AbstractRepository {
    constructor () {
        super("partners");
    }
  
    async post(partner: PartnerInterface) {
        const result = await this.collection.insertOne(partner);
        return result.insertedId;
    }

    async get(id: string) {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return result ? Partner.parser(result) : null;
    }

    async getAll() {
        const cursor = this.collection.find({});
        const results = await cursor.toArray();
        return results.map(doc => Partner.parser(doc));
    }

    async findByCode(code: string) {
        const result = await this.collection.findOne({ code: code });
        return result ? Partner.parser(result) : null;
    }

    async findByEmail(email: string) {
        const result = await this.collection.findOne({ email: email });
        return result ? Partner.parser(result) : null;
    }

    async put(id: string, partner: Partial<PartnerInterface>) {
        delete partner._id
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: partner }
        );
        return result.matchedCount === 1;
    }

    async delete(id: string) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    }
}