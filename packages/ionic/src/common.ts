import * as _ from 'lodash';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path.split('/').filter(s => !_.some(keywords, key => key === s)).join('.');
};
