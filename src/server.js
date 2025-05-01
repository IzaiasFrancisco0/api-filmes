import Fastify from 'fastify';
import filmesRouter from './routes/filmesRouter.js';
import { connectToMongo } from './config/db.js';
import cors from '@fastify/cors';

const app = Fastify();

app.register(cors, {
  origin: ['http://localhost:5173', 'https://site-filmes-phi.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

const start = async () => {
  try {
    const db = await connectToMongo();
    await app.register(filmesRouter, { db });

    await app.listen({ port: 5000, host: '0.0.0.0' });
    console.log('Servidor rodando!!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
