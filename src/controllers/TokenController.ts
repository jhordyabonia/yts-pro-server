/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 20-09-2025
 * 
 * Controller/Router para la gestión de Tokens
 */
'use-strict'
import express from 'express';

import { Token } from "../models/Tokens/Token"
import { TokenRepository } from "../models/Tokens/TokenRepository"
import { response } from './UserController';

const TokenController = async () => {
    const repository = new TokenRepository()
    await repository.start().catch(console.dir);
    
    const router = express.Router();  

    router.post('/', async (req, res) => {
        const token = Token.parser(req.body)   
        token.created_date = new Date();
        try {
            const idInsert = await repository.post(token)        
            res.status(200).json(response(idInsert));
        } catch(error) {            
            res.status(422).json(response(error, "error"));
        }
    });

    router.get('/', async (req, res) => {        
        const tokens = await repository.getAll(res.params)
        res.status(200).json(response(tokens));        
    });

    router.get('/:id', async (req, res) => {
        const tokenId = req.params.id
        if (tokenId && tokenId.length > 0) {
            const token = await repository.get(tokenId)
            if (token == null) {
                res.status(404).json(response(`Token ${tokenId} not found!`, "error"));
            } else {
                res.status(200).json(response(token));
            }
        } else {
            res.status(422).json(response("_id must not be null", "error"));
        }
    });

    router.put('/:id', async (req, res) => {
        const tokenId = req.params.id
        const token = Token.parser(req.body)
        try {
            const idInsert = await repository.put(tokenId, token)
            if(idInsert) {
                res.status(200).json(response(idInsert));
            } else {
                res.status(404).json(response(`Token ${tokenId} not found!`, "error"));
            }
        } catch(error) {            
            res.status(422).json(response(error, "error"));
        }
    });

    router.patch('/:id', async (req, res) => {
        const tokenId = req.params.id
        const token = req.body
        try {
            const idInsert = await repository.put(tokenId, token)        
            res.status(200).json(response(idInsert));
        } catch(error) {            
            res.status(422).json(response(error, "error"));
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const tokenId = req.params.id
            const deletedCount = await repository.delete(tokenId)
            res.status(200).json(response(deletedCount));
        } catch(error) {            
            res.status(422).json(response(error, "error"));
        }
    });

    return router
}

export { TokenController }