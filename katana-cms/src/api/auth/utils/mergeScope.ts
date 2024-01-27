import { sanitizeProject } from '../../../utils/format';

export type ScopeType = ReturnType<typeof sanitizeProject> & {
  canBeRead: boolean;
  canBeWrite: boolean;
  isCreator: boolean;
};

export function mergeScope({
  treasuryCanBeWrite,
  treasuryCanBeRead,
  treasuryCreators
}: {
  treasuryCanBeWrite: ScopeType[];
  treasuryCanBeRead: ScopeType[];
  treasuryCreators: ScopeType[];
}): ScopeType[] {
  if (!treasuryCanBeRead.length && !treasuryCreators.length) return treasuryCanBeWrite;
  if (!treasuryCanBeWrite.length && !treasuryCreators.length) return treasuryCanBeRead;

  const output: ScopeType[] = [];
  const deepScope = [...treasuryCreators, ...treasuryCanBeWrite, ...treasuryCanBeRead];

  const idxTreasuriesCanBeWrite = treasuryCanBeWrite.map((item) => item.id);
  const idxTreasuriesCreators = treasuryCreators.map((item) => item.id);

  for (let index in deepScope) {
    const item = deepScope[index];

    const findIndexInScope = output.findIndex((treasury) => {
      return treasury.id === item.id;
    });

    if (findIndexInScope === -1) {
      output.push(item);
    } else {
      const itemInScope = output[findIndexInScope];
      const isWriting = idxTreasuriesCanBeWrite.includes(itemInScope.id);
      const isCreator = idxTreasuriesCreators.includes(itemInScope.id);

      if (!itemInScope.isCreator) {
        if (isWriting) {
          output[findIndexInScope].canBeRead = true;
          output[findIndexInScope].canBeWrite = true;
        }
        if (isCreator) {
          output[findIndexInScope].canBeRead = true;
          output[findIndexInScope].canBeWrite = true;
          output[findIndexInScope].isCreator = true;
        }
      }
    }
  }

  return output;
}
