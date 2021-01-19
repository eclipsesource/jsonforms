import React from 'react';
import { layout } from '@jsonforms/examples';
import { Demo } from '../common';

export const HorizontalLayout = () => (
  <Demo
    data={layout.data}
    uischema={layout.uischemaHorizontal}
    schema={layout.schema}
  />
);

export const VerticalLayout = () => (
  <Demo
    data={layout.data}
    uischema={layout.uischemaVertical}
    schema={layout.schema}
  />
);

export const Group = () => (
  <Demo
    data={layout.data}
    uischema={layout.uischemaGroup}
    schema={layout.schema}
  />
);

export const NestedLayouts = () => (
  <Demo
    data={layout.data}
    uischema={layout.uischemaComplex}
    schema={layout.schema}
  />
);
