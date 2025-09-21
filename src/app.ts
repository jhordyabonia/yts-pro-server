

/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * */
'use-strict'
import express from 'express';
import cors  from 'cors';

import { TokenController } from "./controllers/TokenController"
import { PartnerController } from "./controllers/PartnerController"
import { ContractController } from "./controllers/ContractController"
import { UserController } from "./controllers/UserController"
import { authenticateTokenAdmin } from './validation/contractValidation';

const server = async (port: number)=>{
    const app = express();
    const userRouter = await UserController()
    const adminRouter = await ContractController()
    const tokenRouter = await TokenController()
    const partnerRouter = await PartnerController()

    app.use(cors());
    app.use(express.json());
    app.use('/v1/user/', userRouter);
    app.use('/v1/contracts/', authenticateTokenAdmin, adminRouter);
    app.use('/v1/tokens/', authenticateTokenAdmin, tokenRouter);
    app.use('/v1/partners/', authenticateTokenAdmin, partnerRouter);
  
    app.listen(port);
}

//server(Number(process.env.PORT) || 3000)
server(3000)