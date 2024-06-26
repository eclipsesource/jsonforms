import type { UISchemaElement } from '@jsonforms/core';
import merge from 'lodash/merge';
import { inject } from 'vue';
import { defaultStyles } from './defaultStyles';

const createEmptyStyles = (): Styles => ({
  control: {},
  verticalLayout: {},
  horizontalLayout: {},
  group: {},
  arrayList: {},
  listWithDetail: {},
  label: {},
  categorization: {},
});

export interface Styles {
  control: {
    root?: string;
    input?: string;
  };
  verticalLayout: {
    root?: string;
    item?: string;
  };
  horizontalLayout: {
    root?: string;
    item?: string;
  };
  group: {
    root?: string;
    label?: string;
    item?: string;
    bare?: string;
    alignLeft?: string;
  };
  arrayList: {
    root?: string;
    toolbar?: string;
    validationIcon?: string;
    container?: string;
    addButton?: string;
    label?: string;
    noData?: string;
    item?: string;
    itemContainer?: string;
    itemHeader?: string;
    itemLabel?: string;
    itemContent?: string;
    itemMoveUp?: string;
    itemMoveDown?: string;
    itemDelete?: string;
  };
  listWithDetail: {
    root?: string;
    toolbar?: string;
    addButton?: string;
    label?: string;
    noData?: string;
    item?: string;
    itemLabel?: string;
    itemContent?: string;
    itemMoveUp?: string;
    itemMoveDown?: string;
    itemDelete?: string;
  };
  label: {
    root?: string;
  };
  categorization: {
    root?: string;
  };
}

export const useStyles = (element?: UISchemaElement): Styles => {
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
