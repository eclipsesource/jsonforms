import React from 'react';
import { categorization, stepper, steppershownav } from '@jsonforms/examples';
import { Demo } from '../common';

export const Categorization = () => (
  <Demo
    data={categorization.data}
    schema={categorization.schema}
    uischema={categorization.uischema}
  />
);

export const CategorizationStepper = () => (
  <Demo
    data={stepper.data}
    schema={stepper.schema}
    uischema={stepper.uischema}
  />
);

export const CategorizationStepperNav = () => (
  <Demo
    data={steppershownav.data}
    schema={steppershownav.schema}
    uischema={steppershownav.uischema}
  />
);