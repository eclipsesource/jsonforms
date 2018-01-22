export * from './core';
export * from './helpers';
export * from './legacy/schema.service';

export * from './models/jsonSchema';
export * from './store';
export * from './actions';
import * as Actions from './actions';
export { Actions };
export *  from './renderers';
export * from './reducers';
export * from './generators';

export * from './models/uischema';

import * as Test from './testers';
export * from './testers';
export { Test };

import {
  convertToValidClassName,
  createLabelDescriptionFrom
} from './helpers';
import { ControlElement, LabelDescription } from './models/uischema';

const Helpers: {
  createLabelDescriptionFrom(withLabel: ControlElement): LabelDescription;
  convertToValidClassName(s: string): string } = {

  createLabelDescriptionFrom,
  convertToValidClassName
};

export { Helpers };
