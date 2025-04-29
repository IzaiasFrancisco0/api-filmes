import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const filmesRouter = async (fastify, options) => {

  fastify.post('/filme', async (request, reply) => {
    const { image, name, description, category } = request.body;

    if (!image || image.trim() === '') {
      reply.status(400).send({ error: "A URL da imagem é obrigatória" });
      return;
    }

    if (!name || name.trim() === '') {
      reply.status(400).send({ error: "O nome do filme é obrigatório" });
      return;
    }

    if (!description || description.trim() === '') {
      reply.status(400).send({ error: "A descrição do filme é obrigatória" });
      return;
    }

    if (!category || category.trim() === '') {
      return reply.status(400).send({ error: "A categoria do filme é obrigatória" });
    }

    try {
      const filme = await prisma.filme.create({
        data: { image, name, description, category },
      });
      reply.status(201).send("Filme criado com sucesso!!")
    } catch (err) {
      reply.status(500).send(err);
    }
  });

  fastify.get('/filmes', async (request, reply) => {
    try {
      const filmes = await prisma.filme.findMany();
      reply.send(filmes);
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao recuperar filmes', details: err });
    }
  });

  fastify.put('/filmes/:id', async (request, reply) => {
     const {id} = request.params;
     const { image, name, description, category } = request.body;

     try{
       const filmeAtualizado = await prisma.filme.update({
        where: {id},
        data: { image, name, description, category },
       });

       reply.send(filmeAtualizado)
     }catch (err) {
      reply.status(500).send({ error: 'Erro ao atualizar o filme', details: err });
    }
  })

  fastify.delete('/filme/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const deleteMovie = await prisma.filme.delete({
        where: { id },
      });

      reply.status(200).send({ message: 'Filme deletado com sucesso!!', deleteMovie });
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao deletar o filme', detail: err });
    }
  });

  fastify.patch('/filme/:id/category', async (request, reply) => {
    const { id } = request.params;
    const { category } = request.body;
  
    if (!category || category.trim() === '') {
      return reply.status(400).send({ error: 'Categoria obrigatória' });
    }
  
    try {
      const filme = await prisma.filme.update({
        where: { id },
        data: { category },
      });
  
      reply.send("Filme deletado com sucesso!!");
    } catch (err) {
      reply.status(500).send({ error: 'Erro ao atualizar categoria', details: err });
    }
  });
};




export default filmesRouter;
