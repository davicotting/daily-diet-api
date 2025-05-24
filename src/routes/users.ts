import { FastifyInstance } from "fastify";
import { db } from "../database";
import { randomUUID } from "node:crypto";
import * as zod from "zod";

export async function user(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const requestBodySchema = zod.object({
      name: zod.string(),
    });

    const { name } = requestBodySchema.parse(request.body);

    let id = randomUUID();

    if (!request.cookies.userId) {
      reply.setCookie("userId", id, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    await db("users").insert({
      name,
      id,
    });

    return reply.code(201).send({
      message: "Usuario criado com sucesso",
    });
  });
}
