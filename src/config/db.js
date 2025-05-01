import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'filmes';

let db;

export async function connectToMongo() {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
      console.log('Conectado ao MongoDB');
    }
    return db;
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    throw err;
  }
}

export default connectToMongo;