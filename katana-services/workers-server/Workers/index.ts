import ProjectRepository from './Repositories/Project.respository';
import { asyncMap } from '../Utils';
import { ProjectService } from '../Modules/Project/Services/Project.service';
import { APP_DISABLED_LOOP, APP_INTERVAL_EXEC } from '../Config/env';

const projectService = new ProjectService();
const projectRepository = new ProjectRepository();

const ONE_MINUTE = 1000 * 60;

export async function VerifyAndSaveProjects() {
  try {
    await projectRepository.init();

    async function verifyProjects() {
      const { news, updates } = await projectRepository.getItemsForSave();

      if (news.length) {
        const newsProject = projectRepository.serialize(news);
        await asyncMap(newsProject, async (project) => {
          try {
            await projectRepository.createItem(project);
          } catch (e) {
            console.log(`Error al crear el project ${project.treasuryId}`, e);
          }
        });
      }

      if (updates.length) {
        await asyncMap(updates, async (project) => {
          try {
            await projectRepository.updateItem(project._id, project);
          } catch (e) {
            console.log(`Error al actualizar el project ${project.treasuryId}`, e);
          }
        });
      }
    }

    async function verifyTokensForProjects() {
      const projects = projectRepository.getAllProjects();

      // iteration for projects
      await asyncMap(projects, async (project) => {
        try {
          await projectService.updateSPLTokensInProject(project);
        } catch (e) {
          console.log(e);
        }
        try {
          await projectService.updateCollectionsInProject(project);
        } catch (e) {
          console.log(e);
        }
      });
    }

    await verifyProjects();
    await verifyTokensForProjects();
  } catch (e) {
    console.log(e);
  }

  if (!APP_DISABLED_LOOP) {
    setTimeout(async () => {
      await VerifyAndSaveProjects();
    }, ONE_MINUTE * APP_INTERVAL_EXEC);
  } else {
    console.log('Loop worker is disabled');
  }
}
