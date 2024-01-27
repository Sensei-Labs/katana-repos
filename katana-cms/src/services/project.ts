import { fetchSplTokensInstance } from './fetch';

export function getProjectWorker(projectId: number) {
  return fetchSplTokensInstance.get(`/projects/${projectId}`);
}

type PiePayload = {
  colors: string[];
  labels: string[];
  values: number[];
};

export type PayloadPieCategory = {
  statisticDataDaily: PiePayload;
  statisticDataWeekly: PiePayload;
  statisticDataMonthly: PiePayload;
  statisticDataYearly: PiePayload;
  statisticDataAll: PiePayload;
};

export type PayloadLineAmount = {
  statisticDataDaily: {
    colors: string[];
    labels: string[];
    tags: string[];
    data: {
      name: string;
      values: number[];
    }[];
  };
  statisticDataWeekly: {
    colors: string[];
    labels: string[];
    tags: string[];
    data: {
      name: string;
      values: number[];
    }[];
  };
  statisticDataMonthly: {
    colors: string[];
    labels: string[];
    tags: string[];
    data: {
      name: string;
      values: number[];
    }[];
  };
  statisticDataYearly: {
    colors: string[];
    labels: string[];
    tags: string[];
    data: {
      name: string;
      values: number[];
    }[];
  };
};

export enum TRANSACTIONS_TYPE {
  OUT = 'out',
  IN = 'in'
}

export function updateCategoriesGraphProject(
  projectId: number,
  payload: PayloadPieCategory,
  transactionType: TRANSACTIONS_TYPE
) {
  return fetchSplTokensInstance.post(`/statistics/${projectId}/register-pie-data`, { ...payload, transactionType });
}

export function updateAmountGraphProject(projectId: number, payload: PayloadLineAmount, transactionType: TRANSACTIONS_TYPE) {
  return fetchSplTokensInstance.post(`/statistics/${projectId}/register-line-data`, { ...payload, transactionType });
}

export function updateBalancesInProject(
  projectId: number,
  payload: {
    totalInputUsd: number;
    totalOutputUsd: number;
    totalInputSol: number;
    totalOutputSol: number;
  }
) {
  return fetchSplTokensInstance.put(`/projects/${projectId}`, payload);
}
