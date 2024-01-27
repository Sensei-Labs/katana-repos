import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { NotificationState } from '@/Contexts/Notifications';

export function onReadNotification(notificationId: number) {
  const path = `${API_ROUTES.PLURAL_NOTIFICATION.path}/${notificationId}`;

  return api.put(path, {
    data: {
      state: NotificationState.READ
    }
  });
}
