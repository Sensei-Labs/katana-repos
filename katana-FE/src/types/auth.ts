export type ScopeType = {
  candyMachineAddress: string;
  id: number;
  isCreator: boolean;
  isEditor: boolean;
  isViewer: boolean;
};

export type AuthType = {
  hasSenseiToken: boolean;
  hasAccess: boolean;
  scope: ScopeType[];
};
