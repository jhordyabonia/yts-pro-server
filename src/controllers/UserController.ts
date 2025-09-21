
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Controller/Router para la gestion de la app/microservicion Contract
 */
'use-strict'
import express from 'express';

import { ContractRepository } from "../models/Contracts/ContractRepository"
import { TokenRepository } from "../models/Tokens/TokenRepository"
import { authenticateToken, generateToken } from '~/validation/contractValidation';

const response = (data: any,status:string="ok")=>{
    return {status:status,data:data}
}

const UserController = async ()=>{

    const repository = new ContractRepository()
    const tokenRepository = new TokenRepository()
    await repository.start().catch(console.dir);

    const router = express.Router();    


    router.post('/auth/', async (req, res) => {
        const user = req.body.user;
        if (user && user.length > 0) {
            const contract = await repository.getAll({user:user});
            if (contract.length == 0) {
                res.status(404).json(response(`Contract not found!`, "error"));
            } else {
                res.status(200).json(response({user:user,key:generateToken({user:user})}));
            }
        }
    });

    router.get('/contracts/url/:user', authenticateToken, async (req, res) => {
        const user = req.params.user;
        const auth = req.user.user;        
        const url = process.env.IA_URL ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";
        if (user && user.length > 0) {
            if (user !== auth) {
                res.status(403).json(response(`User ${user} unauthorized!`, "error"));
                return;
            }
            const contract = await repository.getAll({user:user});
            if (contract.length == 0) {
                res.status(404).json(response(`Contract not found!`, "error"));
            } else {
                const now = new Date();
                const pay_date = new Date(contract[0].pay_date)
                const due_date = new Date(pay_date); 
                due_date.setMonth(due_date.getMonth() + 1);
                if (due_date < now) {
                    res.status(404).json(response(`Contract for user ${user} has not been paid!`, "error"));
                    return;
                }
                res.status(200).json(response(url+contract[0].key));
            }
        } else {
            res.status(422).json(response("_id must not be null", "error"));
        }
    });

    router.patch('/contracts/pay/:user', authenticateToken, async (req, res) => {
        const user = req.params.user;
        const auth = req.user.user;
        if (user && user.length > 0 && user === auth) {            
            //req.body  //usar para validar pago
            try {
                const contracts = await repository.getAll({ user: user });
                if (contracts.length == 0) {
                    res.status(404).json(response(`Contract for user ${user} not found!`, "error"));
                    return;
                }
                if(contracts.length > 1) {
                    res.status(422).json(response(`More than one contract for user ${user} found!`, "error"));
                    return;
                }
                const contractId = contracts[0]._id;
                if(!contractId) {
                    res.status(422).json(response(`Contract for user ${user} has no _id!`, "error"));
                    return;
                }

                const contract = contracts[0]      
                contract.pay_date = new Date();
                contract.key = await getToken(5);
                delete contract._id;
                const idInsert = await repository.put(contractId, contract)        
                res.status(200).json(response(idInsert));
            }catch(error){            
                res.status(422).json(response(error,"error"));
            }
        }
    });

    async function getToken(length: number) {
        const tokens = await tokenRepository.getAll();
        const availableTokens = tokens.filter(token => token.used <= length)
                                    .sort((a, b) => (a.used || 0) - (b.used || 0)); 
        if (availableTokens.length > 0) {
            const token = availableTokens[0];
            if(token._id) {
                tokenRepository.put(token._id.toString(), {used: token.used + 1});
            }
            return token.api_key;
        }
        return null;
    }

    return router
}

export { UserController,response }