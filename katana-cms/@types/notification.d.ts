declare type NotificationType = {
  title: string;
  body: string;
  date: string;
  question?: number;
  users: number[];
  type: 'question' | 'answer' | 'info' | 'news';
  link?: string;
};

declare type NotificationPayload = {
  title: string;
  content: string;
  link?: string;
  question?: number;
  treasury?: number;
  type: 'question' | 'answer' | 'info' | 'news';
};
