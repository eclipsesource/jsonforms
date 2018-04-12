import { taskView, userGroupView, userView } from './uischemata';

export const labelProvider = {
  '#user': 'name',
  '#userGroup': 'label',
  '#task': 'name',
};

export const imageProvider = {
  '#task': 'task',
  '#user': 'user',
  '#userGroup': 'userGroup'
};

export const modelMapping = {
  'attribute': '_type',
  'mapping': {
    'task': '#task',
    'user': '#user',
    'userGroup': '#userGroup'
  }
};

export const detailSchemata = {
  '#task': taskView,
  '#user': userView,
  '#userGroup': userGroupView,
};
