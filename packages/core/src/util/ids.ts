const usedIDs: Set<string> = new Set<string>();

export const createId = (proposedID: string) => {
  if (proposedID === undefined) {
    // failsafe to avoid endless loops in error cases
    proposedID = 'undefined';
  }
  let tries = 1;
  while (!isUniqueId(proposedID, tries)) {
    tries++;
  }
  const newID = makeId(proposedID, tries);
  usedIDs.add(newID);
  return newID;
};

export const removeId = id => usedIDs.delete(id);

const isUniqueId = (idBase: string, iteration: number) => {
  const newID = makeId(idBase, iteration);
  return !usedIDs.has(newID);
};

const makeId = (idBase: string, iteration: number) => iteration <= 1 ? idBase : idBase + iteration;

export const clearAllIds = () => usedIDs.clear();
