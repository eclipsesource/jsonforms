import React from 'react';
import { person } from '@jsonforms/examples';
import { Demo } from '../../common';

export const PersonVars = () => (
  <Demo
    schema={person.schema}
    uischema={person.uischema}
    data={person.data}
  />
)
