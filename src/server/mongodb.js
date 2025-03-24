
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
}

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
