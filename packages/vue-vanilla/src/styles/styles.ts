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
  label: {},
  dialog: {},
  oneOf: {},
  categorization: {},
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
    asterisk?: string;
    required?: string;
  };
  dialog: {
    root?: string;
    title?: string;
    body?: string;
    actions?: string;
    buttonPrimary?: string;
    buttonSecondary?: string;
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
  oneOf: {
    root?: string;
  };
  categorization: {
    root?: string;
    category?: string;
    selected?: string;
    panel?: string;
    stepper?: string;
    stepperBadge?: string;
    stepperLine?: string;
    stepperFooter?: string;
    stepperButtonBack?: string;
    stepperButtonNext?: string;
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
