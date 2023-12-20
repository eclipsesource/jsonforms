import { UISchemaElement } from '@jsonforms/core';
import { inject } from 'vue';
import merge from 'lodash/merge';
import { defaultStyles } from './defaultStyles';

const createEmptyStyles = (): Styles => ({
});

export interface Styles {
  addButton?: string;
  itemMoveUp?: string;
  itemMoveDown?: string;
  itemDelete?: string;
}

export const useStyles = (element?: UISchemaElement) => {
  const userStyles = inject('styles', defaultStyles);
  if (!element?.options?.styles) {
    return userStyles;
  }
  const styles = createEmptyStyles();
  if (userStyles) {
    merge(styles, userStyles);
  } else {
    merge(styles, defaultStyles);
  }
  if (element?.options?.styles) {
    merge(styles, element.options.styles);
  }
  return styles;
};
