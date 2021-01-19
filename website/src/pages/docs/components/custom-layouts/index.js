import React from 'react';
import {
  Demo,
  myGroupTester,
  MyGroupRenderer,
} from '../../../../components/common';
import { materialRenderers } from '@jsonforms/material-renderers';

const groupData = {
  name: 'John Doe',
};

const groupSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
};

const groupUiSchema = {
  type: 'Group',
  label: 'My Group!',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
    },
  ],
};

export const Default = () => (
  <Demo data={groupData} schema={groupSchema} uischema={groupUiSchema} />
);

export const WithCustomRenderer = () => (
  <Demo
    data={groupData}
    schema={groupSchema}
    uischema={groupUiSchema}
    renderers={[
      ...materialRenderers,
      { tester: myGroupTester, renderer: MyGroupRenderer },
    ]}
  />
);
