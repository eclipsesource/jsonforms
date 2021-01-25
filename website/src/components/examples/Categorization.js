import React from 'react';
import { categorization, stepper, steppershownav } from '@jsonforms/examples';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Demo from '../common/Demo';
import { createJsonFormsStore } from '../../common/store';

const categorizationStore = createJsonFormsStore({
  data: categorization.data,
  schema: categorization.schema,
  uischema: categorization.uischema,
});

const categorizationStepperStore = createJsonFormsStore({
  data: stepper.data,
  schema: stepper.schema,
  uischema: stepper.uischema,
});

const categorizationStepperNavStore = createJsonFormsStore({
  data: steppershownav.data,
  schema: steppershownav.schema,
  uischema: steppershownav.uischema,
});

export const Categorization = () => (
  <Provider store={categorizationStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={categorization.schema}
        uischema={categorization.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const CategorizationStepper = () => (
  <Provider store={categorizationStepperStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={stepper.schema}
        uischema={stepper.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const CategorizationStepperNav = () => (
  <Provider store={categorizationStepperNavStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={steppershownav.schema}
        uischema={steppershownav.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);
