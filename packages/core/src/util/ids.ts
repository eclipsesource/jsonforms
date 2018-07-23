import { UISchemaElement } from '..';

const idMappings: Map<UISchemaElement, string> = new Map<UISchemaElement, string>();

export const createId = (element: UISchemaElement, proposedID: string) => {
  let tries = 0;
  while (!isUniqueId(proposedID, tries)) {
    tries++;
  }
  const newID = makeId(proposedID, tries);
  idMappings.set(element, newID);
  return newID;
};

export const removeId = uischema => idMappings.delete(uischema);

const isUniqueId = (idBase: string, iteration: number) => {
  const newID = makeId(idBase, iteration);
  for (const value of Array.from(idMappings.values())) {
    if (value === newID) {
      return false;
    }
  }
  return true;
};

const makeId = (idBase: string, iteration: number) => idBase + iteration;

export const clearAllIds = () => idMappings.clear();
