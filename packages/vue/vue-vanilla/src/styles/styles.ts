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
    root?: string;
    wrapper?: string;
    label?: string;
    description?: string;
    error?: string;
    input?: string;
    textarea?: string;
    select?: string;
    option?: string;
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
  };
  arrayList: {
    root?: string;
    legend?: string;
    addButton?: string;
    label?: string;
    itemWrapper?: string;
    noData?: string;
    item?: string;
    itemToolbar?: string;
    itemLabel?: string;
    itemContent?: string;
    itemExpanded?: string;
    itemMoveUp?: string;
    itemMoveDown?: string;
    itemDelete?: string;
  };
  label: {
    root?: string;
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
