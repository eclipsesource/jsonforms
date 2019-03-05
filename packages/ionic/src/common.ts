import some from 'lodash/some';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path
    .split('/')
    .filter(s => !some(keywords, key => key === s))
    .join('.');
};
