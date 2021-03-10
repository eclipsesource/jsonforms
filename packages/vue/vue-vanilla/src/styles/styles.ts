import { UISchemaElement } from '@jsonforms/core';
import { inject } from '../../config/vue';
import merge from 'lodash/merge';
import { defaultStyles } from './defaultStyles';

const createEmptyStyles = (): Styles => ({
  control: {},
  verticalLayout: {},
  horizontalLayout: {},
  group: {},
  arrayList: {},
  label: {}
});

export interface Styles {
  control: {
    root?: String;
    wrapper?: String;
    label?: String;
    description?: String;
    error?: String;
    textarea?: String;
    select?: String;
    option?: String;
  };
  verticalLayout: {
    root?: String;
    item?: String;
  };
  horizontalLayout: {
    root?: String;
    item?: String;
  };
  group: {
    root?: String;
    label?: String;
    item?: String;
  };
  arrayList: {
    root?: String;
    legend?: String;
    addButton?: String;
    label?: String;
    itemWrapper?: String;
    noData?: String;
    item?: String;
    itemToolbar?: String;
    itemLabel?: String;
    itemContent?: String;
    itemExpanded?: String;
    itemMoveUp?: String;
    itemMoveDown?: String;
    itemDelete?: String;
  };
  label: {
    root?: String;
  };
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
