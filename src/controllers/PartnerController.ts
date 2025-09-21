import express from 'express';
import { Partner } from "../models/Partners/Partner";
import { PartnerRepository } from "../models/Partners/PartnerRepository";
import { response } from './UserController';

const PartnerController = async () => {
    const repository = new PartnerRepository()
    await repository.start().catch(console.dir);
    
    const router = express.Router();

    router.post('/', async (req, res) => {
        const partner = Partner.parser(req.body)
        partner.created_date = new Date();
        partner.code = Partner.generateCode();
        
        try {
            const idInsert = await repository.post(partner)
            res.status(200).json(response(idInsert));
        } catch(error) {
            res.status(422).json(response(error, "error"));
        }
    });

    router.get('/', async (req, res) => {
        const partners = await repository.getAll()
        res.status(200).json(response(partners));
    });

    router.get('/:id', async (req, res) => {
        const partnerId = req.params.id
        if (partnerId && partnerId.length > 0) {
            const partner = await repository.get(partnerId)
            if (partner == null) {
                res.status(404).json(response(`Partner ${partnerId} not found!`, "error"));
            } else {
                res.status(200).json(response(partner));
            }
        } else {
            res.status(422).json(response("_id must not be null", "error"));
        }
    });

    router.get('/code/:code', async (req, res) => {
        const code = req.params.code
        const partner = await repository.findByCode(code)
        if (partner == null) {
            res.status(404).json(response(`Partner with code ${code} not found!`, "error"));
        } else {
            res.status(200).json(response(partner));
        }
    });

    router.put('/:id', async (req, res) => {
        const partnerId = req.params.id
        const partner = Partner.parser(req.body)
        try {
            const idInsert = await repository.put(partnerId, partner)
            if(idInsert) {
                res.status(200).json(response(idInsert));
            } else {
                res.status(404).json(response(`Partner ${partnerId} not found!`, "error"));
            }
        } catch(error) {
            res.status(422).json(response(error, "error"));
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const partnerId = req.params.id
            const deletedCount = await repository.delete(partnerId)
            res.status(200).json(response(deletedCount));
        } catch(error) {
            res.status(422).json(response(error, "error"));
        }
    });

    return router
}

export { PartnerController }