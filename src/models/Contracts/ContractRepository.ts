
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Repository/Contract para la gestion del los datos de la app/microservicion Contract
 */
'use-strict'
import { ObjectId } from 'mongodb';
import { ContractInteface } from './ContractInteface';    
import { AbstractRepository } from '../AbstracRepository';
/*import {config} from 'dotenv'*/

class  ContractRepository extends AbstractRepository {
    constructor () {
        super("contracts");
    }
  
    /**
     * @method post inserta item Contract en base de datos mongodb
     * @param contract item Contract a insertar de base de datos
     */
    post = async(contract: ContractInteface)=>{        
        const {insertedId} = await this.collection.insertOne(contract);
        return insertedId       
    }    
    
    /**
     * @method get obtine el item Contract con _id=id de base de datos mongodb
     */
    get = async(id:string)=>{
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }
    
    /**
     * @method gatAll Obetinela lista de items Contract de la base de datos mongodb
     * coincidentes que query
     * @param query filtro: obejeto tipo Contract
     */
    getAll = async(query:object={})=>{
        return await this.collection.find(query).toArray();
    }

    /**
     * @method put actualiza completamente el item Contract  con _id=id en base de datos mongodb
     * @param contract objecto a actualizar
     */
    put = async( _id: string, contract: ContractInteface)=>{
        delete contract._id;
        await this.collection.updateOne( { _id: new ObjectId(_id) },{$set:contract})
        return await this.get(_id);
    }
    
    /**
     * @method delete elimina completamente el item Contract  con _id=id de la base de datos mongodb
     * @param id it Contract a eliminar
     */
    delete = async( id: string )=>{
        const deletedCount = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return deletedCount
    }
    
}

export { ContractRepository }