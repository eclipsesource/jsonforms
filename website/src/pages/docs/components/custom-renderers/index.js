import React from 'react';
import { registerRenderer } from '@jsonforms/core';
import { JsonFormsDispatch, JsonFormsReduxContext } from '@jsonforms/react';
import { createJsonFormsStore } from '../../../../common/store';
import {
  Demo,
  ratingControlTester,
  RatingControl
} from '../../../../components/common';
import { Provider } from 'react-redux';

const ratingData = {
  rating: 2
};

const ratingSchema = {
  type: 'object',
  properties: {
    rating: {
      type: 'integer',
      minimum: 0,
      maximum: 5
    }
  }
};

const ratingUiSchema = {
  type: 'Control',
  scope: '#/properties/rating'
};

const storeWithRatingControlExample = createJsonFormsStore({
  data: ratingData,
  schema: ratingSchema,
  uischema: ratingUiSchema
});

const store = createJsonFormsStore({
  data: ratingData,
  schema: ratingSchema,
  uischema: ratingUiSchema
});

export const Default = () => (
  <Provider store={store}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={ratingSchema}
        uischema={ratingUiSchema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const WithCustomRenderer = () => (
  <Provider store={storeWithRatingControlExample}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          storeWithRatingControlExample.dispatch(
            registerRenderer(ratingControlTester, RatingControl)
          );
          return <JsonFormsDispatch />;
        }}
        schema={ratingSchema}
        uischema={ratingUiSchema}
      />
    </JsonFormsReduxContext>
  </Provider>
);
