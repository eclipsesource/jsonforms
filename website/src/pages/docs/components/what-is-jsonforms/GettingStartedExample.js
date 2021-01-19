import React from 'react';
import {
  Demo,
  RatingControl,
  ratingControlTester,
} from '../../../../components/common';
import { materialRenderers } from '@jsonforms/material-renderers';

export const IntroCode = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      done: {
        type: 'boolean',
      },
      rating: {
        type: 'integer',
      },
    },
    required: ['name'],
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/description',
        options: {
          multi: true,
        },
      },
      {
        type: 'Control',
        label: 'Rating',
        scope: '#/properties/rating',
      },
      {
        type: 'Control',
        label: 'Done?',
        scope: '#/properties/done',
      },
    ],
  },
};

export const GettingStartedExample = () => (
  <Demo data={{}} schema={IntroCode.schema} uischema={IntroCode.uischema} />
);

export const GettingStartedExampleWithRatingControl = () => (
  <Demo
    data={{}}
    schema={IntroCode.schema}
    uischema={IntroCode.uischema}
    renderers={[
      ...materialRenderers,
      { tester: ratingControlTester, renderer: RatingControl },
    ]}
  />
);
