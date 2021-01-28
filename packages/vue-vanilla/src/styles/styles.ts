import { UISchemaElement } from '@jsonforms/core';
import { inject } from 'vue';
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
    item?: String;
    noData?: String;
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
  const userStyles = inject('styles');
  if (!userStyles && !element?.options?.styles) {
    return defaultStyles;
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
