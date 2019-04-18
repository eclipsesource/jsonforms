import React from 'react';
import {Provider} from 'react-redux';
import {registerRenderer} from '@jsonforms/core';
import {JsonForms} from '@jsonforms/react';
import {Demo, RatingControl, ratingControlTester} from '../../../../components/common';
import {createJsonFormsStore} from "../../../../common/store";

export const IntroCode = 
{
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      done: {
        type: 'boolean'
      },
      rating: {
        type: 'integer'
      }
    },
    required: ['name']
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        scope: '#/properties/description',
        options: {
          multi: true
        }
      },
      {
        type: 'Control',
        label: 'Rating',
        scope: '#/properties/rating'
      },
      {
        type: 'Control',
        label: 'Done?',
        scope: '#/properties/done'
      }
    ]
  },
};

const storeWithoutCustomControl = createJsonFormsStore({
    data: {},
    schema: IntroCode.schema,
    uischema: IntroCode.uischema
});

const storeWithRatingControlExample = createJsonFormsStore({
    data: {},
    schema: IntroCode.schema,
    uischema: IntroCode.uischema
});

export const GettingStartedExample = () => (
    <Provider store={storeWithoutCustomControl}>
        <Demo
            js={() => <JsonForms />}
            schema={IntroCode.schema}
            uischema={IntroCode.uischema}
        />
    </Provider>
);

export const GettingStartedExampleWithRatingControl = () => (
    <Provider store={storeWithRatingControlExample} >
        <Demo
            js={() => {
                storeWithRatingControlExample.dispatch(registerRenderer(ratingControlTester, RatingControl));
                return (
                    <JsonForms
                        schema={IntroCode.schema}
                        uischema={IntroCode.uischema}
                    />
                )
            }}
            schema={IntroCode.schema}
            uischema={IntroCode.uischema}
        />
    </Provider>
)