/* eslint-disable @typescript-eslint/indent */
import { CMSProjectsInterface, WorkerInterface } from '../Interfaces';
import ProjectModel, { IProjectModel } from '../../Modules/Project/Models/Project.model';
import ProjectFetchRepository from './ProjectFetch.repository';

const projectFetchRepository = new ProjectFetchRepository();

export type ProjectType = Pick<
  IProjectModel,
  '_id' | 'image' | 'name' | 'treasuryId' | 'tokens' | 'treasuryAddresses' | 'collections'
>;

class ProjectRepository implements WorkerInterface<ProjectType, CMSProjectsInterface> {
  private projectsDB: ProjectType[] = [];

  private cmsProjects: CMSProjectsInterface[] = [];

  public async init() {
    this.projectsDB = await ProjectModel.find({}).populate('tokens');
    this.cmsProjects = await projectFetchRepository.get();
  }

  public async getItemsForSave() {
    const news: CMSProjectsInterface[] = [];
    const updates: ProjectType[] = [];
    const removes: ProjectType[] = [];

    this.cmsProjects.forEach((cmsProject) => {
      const project = this.projectsDB.find((projectFind) => {
        return projectFind.treasuryId === cmsProject.id.toString();
      });

      const cmsTreasuryAddresses = cmsProject?.treasuryAddresses?.map((item) => item.address) || [];
      const projectTreasuryAddresses =
        project?.treasuryAddresses?.map((item) => item.address) || [];

      if (!project) {
        news.push(cmsProject);
      } else if (
        cmsProject.name !== project.name ||
        cmsProject.thumbnail?.url !== project.image ||
        JSON.stringify(cmsTreasuryAddresses) !== JSON.stringify(projectTreasuryAddresses) ||
        JSON.stringify(cmsProject?.collection_nfts_addresses || []) !==
          JSON.stringify(project?.collections || [])
      ) {
        project.name = cmsProject.name;
        project.treasuryAddresses = cmsProject?.treasuryAddresses || [];
        project.image = cmsProject.thumbnail?.url || '';
        project.collections = cmsProject.collection_nfts_addresses;
        updates.push(project);
      }
    });

    return {
      news,
      removes,
      updates,
    };
  }

  public serialize(items: CMSProjectsInterface[]): ProjectType[] {
    return items.map((payload) => ({
      treasuryId: payload.id,
      name: payload.name,
      image: payload.thumbnail?.url,
      treasuryAddresses: payload?.treasuryAddresses || [],
      tokens: [],
      collections: payload?.collection_nfts_addresses || [],
    }));
  }

  public async createItem(payload: ProjectType) {
    console.log('Creating project: ', payload.treasuryId);
    const newProject = ProjectModel.create(payload);

    this.projectsDB = await ProjectModel.find({}).populate('tokens');

    return newProject;
  }

  public getAllProjects() {
    return this.projectsDB;
  }

  public async updateItem(projectId: string, payload: ProjectType) {
    console.log('Updating project: ', projectId);
    return ProjectModel.findByIdAndUpdate(projectId, payload);
  }
}

export default ProjectRepository;
