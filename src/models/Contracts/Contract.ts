
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Model/Tasks modelo de datos de la app/microservicion Tasks
 */
'use-strict'

import { ContractInteface } from "./ContractInteface"

class  Contract implements ContractInteface {
    _id: string
    user: string
    status: string
    used: number
    created_date: Date
    pay_date: Date
    key: string
    
    constructor() {}
    static STATUS = ["pending","active","unactive","canceled","expired"];

    static parser = (data:Contract):Contract=>{
        const contract = new Contract()
        contract._id            = data._id?data._id:contract._id
        contract.user          = data.user??contract.user
        contract.status       = data.status??contract.status
        contract.used         = data.used??contract.used
        contract.created_date = data.created_date??contract.created_date
        contract.pay_date    = data.pay_date??contract.pay_date
        contract.key         = data.key??contract.key
        return contract
    }
}

export { Contract }