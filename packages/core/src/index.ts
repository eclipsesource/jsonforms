export * from './core';
export * from './json-forms';
export * from './core/renderer';
export * from './core/runtime';
export * from './core/schema.service';
export * from './core/styling.registry';

export * from './models/jsonSchema';
export * from './store';
export *  from './actions';
export *  from './renderers';
export * from './reducers';
export * from './generators';
export * from './helpers';

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
