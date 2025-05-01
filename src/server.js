import Fastify from 'fastify';
import filmesRouter from './routes/filmesRouter.js';
import { connectToMongo } from './config/db.js';
import cors from '@fastify/cors';

const app = Fastify();

app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

const start = async () => {
  try {
    const db = await connectToMongo();
    await app.register(filmesRouter, { db });

    await app.listen({ port: 5000 });
    console.log('🚀 Servidor rodando em http://localhost:5000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
