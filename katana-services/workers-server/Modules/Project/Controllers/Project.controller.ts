import { FastifyReply, FastifyRequest } from 'fastify';
import ProjectModel from '../Models/Project.model';
import { ProjectService } from '../Services/Project.service';

const projectService = new ProjectService();

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const projects = await ProjectModel.find().populate(['tokens']);
    reply.code(200).send(projects);
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}

export async function getById(
  request: FastifyRequest<{
    Params: { treasuryId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const { treasuryId } = request.params;
    const project = await projectService.findOne({
      treasuryId,
    });

    project.tokens = projectService.getTokensInProject(project.tokens);

    reply.code(200).send(project);
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}

export async function updateSplTokensForProject(
  request: FastifyRequest<{
    Params: { treasuryId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const data = await projectService.findOne({ treasuryId: request.params.treasuryId });
    if (data) {
      projectService.updateSPLTokensInProject(data).then(() => {
        console.log(`Update SPL Tokens for project ${data.id} successfully`);
      });
      reply.code(200).send(data);
    } else {
      reply.code(404).send({ message: 'Project not found' });
    }
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}

export async function updateProject(
  request: FastifyRequest<{
    Params: { treasuryId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const data = await projectService.findOne({ treasuryId: request.params.treasuryId });
    if (data) {
      const updated = await projectService.updateOne(
        { treasuryId: request.params.treasuryId },
        request.body || {},
      );
      reply.code(200).send(updated);
    } else {
      reply.code(404).send({ message: 'Project not found' });
    }
  } catch (e) {
    console.log(e);
    reply.code(500).send(e);
  }
}
