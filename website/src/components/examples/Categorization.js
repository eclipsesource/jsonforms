import React from 'react';
import { categorization, stepper, steppershownav } from '@jsonforms/examples';
import { Demo } from '../common/Demo';
import get from 'lodash/get';

const translations = {
  categoryLabelKey: 'Basic',
  address: {
    label: 'Address',
  },
};
const translate = (key, defaultMessage) => {
  return get(translations, key) ?? defaultMessage
};
const i18n = {locale: 'en', translate: translate};

export const Categorization = () => (
  <Demo
    i18n= {i18n}
    data={categorization.data}
    schema={categorization.schema}
    uischema={categorization.uischema}
  />
);

export const CategorizationStepper = () => (
  <Demo
    i18n= {i18n}
    data={stepper.data}
    schema={stepper.schema}
    uischema={stepper.uischema}
  />
);

export const CategorizationStepperNav = () => (
  <Demo
    i18n= {i18n}
    data={steppershownav.data}
    schema={steppershownav.schema}
    uischema={steppershownav.uischema}
  />
);