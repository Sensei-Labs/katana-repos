import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectService } from '../../Project/Services/Project.service';
import {
  BodyLine,
  BodyPie,
  resolvePayloadForLineGraphics,
  resolvePayloadForPieGraphics,
  TransactionType,
} from '../utils';

const projectService = new ProjectService();

type BaseBody = { transactionType?: TransactionType };

export async function registerPieGraphic(
  request: FastifyRequest<{
    Params: { treasuryId: string };
    Body: BaseBody & BodyPie;
  }>,
  reply: FastifyReply,
) {
  try {
    const { treasuryId } = request.params;
    const { body } = request;

    const payload = resolvePayloadForPieGraphics(body, body.transactionType);

    const project = await projectService.updateOne({ treasuryId }, payload);
    reply.code(200).send(project);
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}

export async function registerLineGraphic(
  request: FastifyRequest<{
    Params: { treasuryId: string };
    Query: { transactionType?: TransactionType };
    Body: BaseBody & BodyLine;
  }>,
  reply: FastifyReply,
) {
  try {
    const { treasuryId } = request.params;
    const { body } = request;

    const payload = resolvePayloadForLineGraphics(body, body.transactionType);

    const project = await projectService.updateOne({ treasuryId }, payload);
    reply.code(200).send(project);
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}
