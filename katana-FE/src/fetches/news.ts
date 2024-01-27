import { API_ROUTES } from '@/config/api';
import { api } from '@/services/api';

export interface NewsType {
  id: number;
  title: string;
  shortContent: string;
  content: string;
  project: number;
}

export function getAllNews<T = NewsType>(
  projectId?: number,
  params?: { limit: number; page: number }
) {
  if (!projectId) return null;
  return `${API_ROUTES.PLURAL_NEWS.path}/all/${projectId}?pagination[page]=${params?.page}&pagination[pageSize]=${params?.limit}`;
}

export type PayloadCreateNews = Omit<NewsType, 'id'>;

export function createNews<T = NewsType>({
  payload
}: {
  payload: PayloadCreateNews;
}) {
  const path = `${API_ROUTES.PLURAL_NEWS.path}`;

  return api.post<T>(path, {
    data: payload
  });
}

export function editNews<T = NewsType>(
  id: number,
  {
    payload
  }: {
    payload: Partial<PayloadCreateNews>;
  }
) {
  const path = `${API_ROUTES.PLURAL_NEWS.path}/${id}`;

  return api.put<T>(path, {
    data: payload
  });
}

export function deleteNews<T = NewsType>(id: number) {
  const path = `${API_ROUTES.PLURAL_NEWS.path}/${id}`;

  return api.delete<T>(path);
}
