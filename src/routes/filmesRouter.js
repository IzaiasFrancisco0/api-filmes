import { ObjectId } from 'mongodb';
import connectToMongo from '../config/db.js';

const filmesRouter = async (fastify, options) => {
  const db = await connectToMongo();
  const filmesCollection = db.collection('filmes');

  fastify.post('/filme', {
    schema: {
      body: {
        type: 'object',
        required: ['image', 'name', 'description', 'category'],
        properties: {
          image: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { image, name, description, category } = request.body;

    console.log('Dados recebidos:', request.body);

    try {
      const result = await filmesCollection.insertOne({ image, name, description, category });
      reply.status(201).send({ message: 'Filme criado com sucesso!', id: result.insertedId });
    } catch (err) {
      reply.status(500).send(err);
    }
  });

  fastify.get('/filmes', async (_, reply) => {
    try {
      const filmes = await filmesCollection.find().toArray();
      reply.send(filmes);
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao recuperar filmes', details: err });
    }
  });

  fastify.put('/filmes/:id', async (request, reply) => {
    const { id } = request.params;
    const { image, name, description, category } = request.body;

    try {
      const result = await filmesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { image, name, description, category } }
      );

      if (result.matchedCount === 0) {
        return reply.status(404).send({ error: 'Filme não encontrado' });
      }

      reply.send({ message: 'Filme atualizado com sucesso!' });
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao atualizar o filme', details: err });
    }
  });

  fastify.delete('/filme/:id', async (request, reply) => {
    const { id } = request.params;
    console.log('ID recebido:', id); 

    if (!ObjectId.isValid(id)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }

    try {
      const result = await filmesCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return reply.status(404).send({ error: 'Filme não encontrado' });
      }

      reply.send({ message: 'Filme deletado com sucesso!' });
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao deletar o filme', details: err.message });
    }
  });


  fastify.patch('/filme/:id/category', async (request, reply) => {
    const { id } = request.params;
    const { category } = request.body;

    if (!category) {
      return reply.status(400).send({ error: 'Categoria obrigatória' });
    }

    try {
      const result = await filmesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { category } }
      );

      if (result.matchedCount === 0) {
        return reply.status(404).send({ error: 'Filme não encontrado' });
      }

      reply.send({ message: 'Categoria atualizada com sucesso!' });
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao atualizar categoria', details: err });
    }
  });
};

export default filmesRouter;
