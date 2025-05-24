import { FastifyInstance } from "fastify";
import { db } from "../database";
import * as zod from "zod";
import { checkIfUserCookiesExists } from "../middlewares/check-if-user-have-cookies";
import { randomUUID } from "crypto";

export async function snacks(app: FastifyInstance) {
  app.addHook("onRequest", checkIfUserCookiesExists);

  // await db('snacks').where('snack_id', snack_id).andWhere('user_id', userId).first(); get

  // conceito visto nas ultimas aulas do modulo,
  // criamos um hook global  para todas as requisicoes dentro do nosso /snacks

  app.patch("/:snack_id", async (request, reply) => {
    //editar snack
    const requestParamsSchema = zod.object({
      snack_id: zod.string().uuid(),
    });

    const requestBodySchema = zod.object({
      name: zod.string().optional(),
      description: zod.string().optional(),
      inDiet: zod.boolean().optional(),
    });

    const { snack_id } = requestParamsSchema.parse(request.params);

    const { name, description, inDiet } = requestBodySchema.parse(request.body);

    const { userId } = request.cookies;

    const snack = await db("snacks")
      .where("snack_id", snack_id)
      .andWhere("user_id", userId)
      .first();

    if (!snack) {
      return reply.code(404).send({ message: "snack nao encontrada" });
    }

    await db("snacks")
      .where("snack_id", snack_id)
      .andWhere("user_id", userId)
      .update({
        name,
        description,
        inDiet,
      });

    return reply.code(200).send();
  });

  app.get("/:snack_id", async (request, reply) => {
    const requestParamsSchema = zod.object({
      snack_id: zod.string().uuid(),
    });

    const { snack_id } = requestParamsSchema.parse(request.params);

    const { userId } = request.cookies;

    const data = await db("snacks")
      .where("snack_id", snack_id)
      .andWhere("user_id", userId)
      .first();

    if (!data) {
      return reply.code(404).send("Snack nao encontrado");
    }

    return reply.code(200).send({ data });
  });

  app.delete("/:snack_id", async (request, reply) => {
    const requestParamsSchema = zod.object({
      snack_id: zod.string().uuid(),
    });

    const { snack_id } = requestParamsSchema.parse(request.params);

    const { userId } = request.cookies;

    const data = await db("snacks")
      .where("snack_id", snack_id)
      .andWhere("user_id", userId)
      .delete();

    if (!data) {
      return reply.code(404).send({ message: "Snack nao encontrado" });
    }

    return reply.code(200).send();
  });

  app.get("/", async (request, reply) => {
    const { userId } = request.cookies;

    const data = await db("snacks").where("user_id", userId);

    return reply.send({ data });
  });

  app.post("/", async (request, reply) => {
    // criando uma snack

    const requestBodySchema = zod.object({
      name: zod.string(),
      description: zod.string(),
      inDiet: zod.boolean(),
    });

    const { name, description, inDiet } = requestBodySchema.parse(request.body);

    const userId = request.cookies.userId;

    await db("snacks").insert({
      name,
      description,
      inDiet,
      user_id: userId,
      snack_id: randomUUID(),
    });
    return reply.code(201).send();
  });

  app.get("/analytics", async (request, reply) => {

    const { userId } = request.cookies;

    const snack = await db("snacks")
      .andWhere("user_id", userId)
      .first();

    if (!snack) {
      return reply.code(404).send({ message: "voce nao tem nenhuma snack" });
    }

     const inDietTrueTotal = await db("snacks").where("inDiet", true).count({total: "*"}).first();
     const inDietFalseTotal = await db("snacks").where("inDiet", false).count({total: "*"}).first();
     const totalSnacks = await db("snacks").where("user_id", userId).count({total: "*"}).first();

    return reply.code(200).send({
        analytics: {
            inDiet: inDietTrueTotal,
            notInDiet: inDietFalseTotal,
            totalSnacks
        }
    });
  });
}
