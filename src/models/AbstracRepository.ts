
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Repository/Contract para la gestion del los datos de la app/microservicion Contract
 */
'use-strict'
import { any } from 'joi';
import { MongoClient, ServerApiVersion } from 'mongodb';
/*import {config} from 'dotenv'
config();*/
const dbName = process.env.MONGODB_NAME ?? "yts-pro";
const PORT = process.env.MONGODB_PORT ?? 27017
const URL = process.env.MONGODB_URL 
const PASSWORD = process.env.MONGODB_PASSWORD 
//const uri = `${URL}`.replace("<password>",`${PASSWORD}`);
const uri = `mongodb+srv://jhordyabonia:NWXETS8wEfFYT5eg@cluster0.pjtllee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const clientMongoClient = new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export class  AbstractRepository  {
    client : MongoClient;
    collection: any;
    constructor (collectionName:string,clientParam=clientMongoClient) {
        this.client = clientParam;
        try {
            const database = this.client.db(dbName);
            this.collection = database.collection(collectionName);
        } catch (e) {
            console.error("\n❌ Ocurrió un error:", e);
        } finally {
            console.log(`${this.constructor.name} for collection '${collectionName}' initialized.`);
        }
    }
    /**
     * @method start Inicia conexion con base de datos mongodb
     */
    start = async function() {
        // Check if the client is not connected by verifying the topology
        if (!this.client.topology || this.client.topology.isDestroyed()) {
            await this.client.connect();
            console.log(">>>");
        }
    }
    
    /**
     * @method stop detiene conexion con base de datos mongodb
     */
    stop = async function() {
        await this.client.close();
        console.log("\n✅ Conexión cerrada.");
    }
}