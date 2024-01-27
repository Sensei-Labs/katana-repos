import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

const formatNumberDate = (value: number) => {
  if (value < 10) return `0${value}`;
  return value || '-';
};

export const formatDateTime = (_date?: string | Date) => {
  const date = dayjs(_date);
  if (!date.isValid()) return '-';

  return date.format('MM-DD-YYYY HH:mm');
};

export const formatDate = (_date?: string | Date) => {
  if (!_date) return '-';
  const date = _date instanceof Date ? _date : new Date(_date);

  if (!date && (date === 'Invalid date {}' || date === 'Invalid date')) {
    return '-';
  }

  const day = formatNumberDate(date.getUTCDate());
  const month = formatNumberDate(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();

  return `${month}-${day}-${year}`;
};

export const formatDateAgo = (_date?: string | number | Date) => {
  if (!_date) return '-';
  const isUnixTime = typeof _date === 'number';
  const date = dayjs(isUnixTime ? _date * 1000 : _date);
  if (!date.isValid()) return '-';

  return date.fromNow();
};
