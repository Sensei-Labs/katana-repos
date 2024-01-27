import axios from 'axios';

export const fetchNotificationInstance = axios.create({
  baseURL: process.env.APP_NOTIFICATION_SERVER_URL || 'http://localhost:8082',
  headers: {
    Authorization: `Bearer ${process.env.APP_NOTIFICATION_SERVER_TOKEN?.trim() || ''}`
  }
});

const resolveContent = ({ title, type, content, question, treasury, link }: NotificationPayload) => {
  if (type === 'question') {
    return {
      question,
      treasury,
      link,
      title: 'New question',
      content: title
    };
  } else if (type === 'answer') {
    return {
      question,
      treasury,
      link,
      title: title,
      content: 'Click for more information about the question...'
    };
  }
  return {
    question,
    treasury,
    link,
    title: title,
    content: content
  };
};

export default function notificationServer() {
  return {
    pushNotification(walletAddress: string, payload: NotificationPayload) {
      try {
        return fetchNotificationInstance.post(`/api/send-message/${walletAddress}`, resolveContent(payload));
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    pushNotificationAllUsers(payload: NotificationPayload) {
      try {
        return fetchNotificationInstance.post('/api/send-message', resolveContent(payload));
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  };
}
