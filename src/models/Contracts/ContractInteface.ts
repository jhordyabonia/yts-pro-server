
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 *
 * Model/ContractInterface modelo de datos de la app/microservicion Contract
 */
'use-strict'

interface  ContractInteface {

    _id:string
    user:string
    status:string
    used:number
    created_date:Date        
    pay_date:Date
    key:string
}
export { ContractInteface }