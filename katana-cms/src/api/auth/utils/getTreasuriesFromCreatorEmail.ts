import { sanitizeProject } from '../../../utils/format';
import {ScopeType} from "./mergeScope";

export function getTreasuriesFromCreatorEmail(
  treasuries,
  email: string
): ScopeType[] {
  return treasuries
    .filter(({ creator }) => creator?.email === email)
    .map((project) => ({
      ...sanitizeProject(project),
      isCreator: true,
      canBeWrite: true,
      canBeRead: true
    }));
}
