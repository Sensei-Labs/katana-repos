import { API_ROUTES } from '@/config/api';
import { api } from '@/services/api';
import { StateTask } from '@/types/milestone';

// Milestones
export function createMilestone<T = any>(
  projectId: number,
  payload: { title: string; description: string; date: string }
) {
  const path = `${API_ROUTES.PLURAL_MILESTONE.path}`;

  // add treasury id
  (payload as any).treasury = projectId;

  return api.post<T>(path, {
    data: payload
  });
}

export function updateStateMilestone<T = any>(
  milestonesId: number,
  payload: { completed: boolean }
) {
  const path = `${API_ROUTES.PLURAL_MILESTONE.path}/${milestonesId}`;

  return api.put<T>(path, {
    data: payload
  });
}

export function deleteMilestone<T = any>(milestonesId: number) {
  const path = `${API_ROUTES.PLURAL_MILESTONE.path}/${milestonesId}`;

  return api.delete<T>(path);
}

// tasks
export function createTaskInMilestone<T = any>(payload: {
  milestone: number;
  title: string;
  description: string;
  by: string;
}) {
  const path = `${API_ROUTES.PLURAL_TASK.path}`;

  return api.post<T>(path, {
    data: payload
  });
}

export function changeStateToTask<T = any>(taskId: number, state: StateTask) {
  const path = `${API_ROUTES.PLURAL_TASK.path}/${taskId}`;
  return api.put<T>(path, {
    data: {
      state
    }
  });
}

export function deleteTask<T = any>(taskId: number) {
  const path = `${API_ROUTES.PLURAL_TASK.path}/${taskId}`;
  return api.delete<T>(path);
}
