import { FastifyReply, FastifyRequest } from "fastify";

export async function checkIfUserCookiesExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = request.cookies;
  if (!userId) {
    return reply.code(401).send({ message: "Usuario nao autenticado" });
  }
}
