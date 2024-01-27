import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';

export function uploadFile(file: File, name = 'files') {
  const path = `${API_ROUTES.UPLOAD.path}`;

  const form = new FormData();
  form.set(name, file);

  return api.post(path, form);
}
