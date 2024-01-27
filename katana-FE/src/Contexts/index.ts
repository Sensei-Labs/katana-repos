import { TreasuryProvider } from '@/Contexts/Projects';
import { ProjectOneProvider } from '@/Contexts/ProjectOne';
import { TransactionsProvider } from '@/Contexts/Transactions';
import ProjectDetailsProvider from '@/Contexts/ProjectDetails';

export const contextNames = {
  TREASURIES_LIST: 'treasuriesList',
  TREASURY_ONE: 'treasury_one',
  TRANSACTIONS: 'transactions',
  PROJECT_DETAILS: 'project_details'
};

export const resolveContext = {
  [contextNames.TREASURIES_LIST]: TreasuryProvider,
  [contextNames.TREASURY_ONE]: ProjectOneProvider,
  [contextNames.TRANSACTIONS]: TransactionsProvider,
  [contextNames.PROJECT_DETAILS]: ProjectDetailsProvider
};
