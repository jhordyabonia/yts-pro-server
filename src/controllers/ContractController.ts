
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Controller/Router para la gestion de la app/microservicion Contract
 */
'use-strict'
import express from 'express';

import { Contract } from "../models/Contracts/Contract"
import { ContractRepository } from "../models/Contracts/ContractRepository"
import { validateContracts } from '../validation/contractValidation';
import { response } from './UserController';
import { AbstractRepository } from '~/models/AbstracRepository';

const ContractController = async ()=>{

    const repository = new ContractRepository()
    await repository.start().catch(console.dir);

    const router = express.Router();

    router.post('/', validateContracts,async (req, res) => {
        const contract = Contract.parser(req.body)   
        contract.created_date = new Date();
        try{
            const idInsert = await repository.post(contract)        
            res.status(200).json(response(idInsert));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.get('/', async (req, res) => {        
        const contract = await repository.getAll()
        res.status(200).json(response(contract));        
    });

    router.get('/:id', async (req, res) => {
        const contractId = req.params.id
        if (contractId && contractId.length > 0) {
            const contract = await repository.get(contractId)
            if (contract == null) {
                res.status(404).json(response(`Contract ${contractId} not found!`, "error"));
            } else {
                res.status(200).json(response(contract));
            }
        } else {
            res.status(422).json(response("_id must not be null", "error"));
        }
    });

    router.put('/:id', async (req, res) => {
        const contractId = req.params.id
        const contract = Contract.parser(req.body)
         try{
            const idInsert = await repository.put(contractId, contract)
            if(idInsert) {
                res.status(200).json(response(idInsert));
            } else {
                res.status(404).json(response(`Contract ${contractId} not found!`, "error"));
            }
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.patch('/:id', async (req, res) => {
        const contractId = req.params.id
        const contract = req.body
         try{
            const idInsert = await repository.put(contractId, contract)        
            res.status(200).json(response(idInsert));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.delete('/:id', async (req, res) => {
        try{
            const contractId = req.params.id
            const deletedCount = await repository.delete(contractId)
            res.status(200).json(response(deletedCount));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });
    return router
}

export { ContractController }