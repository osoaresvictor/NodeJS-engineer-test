import { FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export function handleHttpError(reply: FastifyReply, err: any) {
  reply.code(err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.message });
}
