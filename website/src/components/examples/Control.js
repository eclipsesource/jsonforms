import React from 'react';
import { controlOptions } from '@jsonforms/examples';
import { Demo } from '../common';

export const Control = () => (
  <Demo
    data={controlOptions.data}
    schema={controlOptions.schema}
    uischema={controlOptions.uischema}
  />
);

export const ExtendedControl = () => (
  <Demo
    data={controlOptions.extendedData}
    schema={controlOptions.extendedSchema}
    uischema={controlOptions.extendedUischema}
  />
);
