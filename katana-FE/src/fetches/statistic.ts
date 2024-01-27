import { API_ROUTES } from '@/config/api';
import resolveUrl from '@/utils/resolveUrl';
import { api } from '@/services/api';

export enum TRANSACTION_DIRECTION {
  IN = 'in',
  OUT = 'out'
}

export function getStatisticLineForProject({
  time,
  transactionType,
  treasuryId,
  showRoyalties
}: {
  treasuryId?: number;
  time?: string;
  showRoyalties?: boolean;

  transactionType?: TRANSACTION_DIRECTION;
}) {
  if (!treasuryId) return null;
  const path = `${resolveUrl(
    API_ROUTES.GET_TREASURY_BY_ID.path,
    API_ROUTES.GET_TREASURY_BY_ID.params.ID,
    treasuryId
  )}/statistic-amount`;

  return {
    url: path,
    params: {
      filters: {
        time,
        showRoyalties,
        transactionType
      }
    }
  };
}

export function getStatisticPieForProject({
  time,
  transactionType,
  treasuryId,
  showRoyalties
}: {
  treasuryId?: number;
  time?: string;
  showRoyalties?: boolean;
  transactionType?: TRANSACTION_DIRECTION;
}) {
  if (!treasuryId) return null;
  const path = `${resolveUrl(
    API_ROUTES.GET_TREASURY_BY_ID.path,
    API_ROUTES.GET_TREASURY_BY_ID.params.ID,
    treasuryId
  )}/statistic-category`;

  return {
    url: path,
    params: {
      filters: {
        time,
        showRoyalties,
        transactionType
      }
    }
  };
}

export function setStatisticPieForProject(treasuryId?: number) {
  if (!treasuryId) return Promise.resolve(null);
  const path = `${resolveUrl(
    API_ROUTES.GET_TREASURY_BY_ID.path,
    API_ROUTES.GET_TREASURY_BY_ID.params.ID,
    treasuryId
  )}/update-category-graph`;

  return api.post(path);
}

export function setStatisticLineForProject(treasuryId?: number) {
  if (!treasuryId) return Promise.resolve(null);
  const path = `${resolveUrl(
    API_ROUTES.GET_TREASURY_BY_ID.path,
    API_ROUTES.GET_TREASURY_BY_ID.params.ID,
    treasuryId
  )}/update-amount-graph`;

  return api.post(path);
}
