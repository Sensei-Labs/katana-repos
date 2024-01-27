import { fetchSplTokensInstance } from './fetch';

export function getSplTokensForProject(projectId: number) {
  return fetchSplTokensInstance.get(`/projects/${projectId}`);
}
