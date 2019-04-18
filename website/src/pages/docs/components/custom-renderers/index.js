import React from 'react';
import { registerRenderer } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { createJsonFormsStore } from "../../../../common/store";
import { Demo, ratingControlTester, RatingControl } from "../../../../components/common";
import { Provider } from "react-redux";

const ratingData = {
  rating: 2,
};

const ratingSchema = {
  type: 'object',
  properties: {
    rating: {
      type: 'integer',
      minimum: 0,
      maximum: 5,
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
           <Demo
             js={() => <JsonForms />}
             schema={ratingSchema}
             uischema={ratingUiSchema}
           />
         </Provider>
       );

export const WithCustomRenderer = () => (
  <Provider store={storeWithRatingControlExample}>
    <Demo
      js={() => {
        storeWithRatingControlExample.dispatch(
          registerRenderer(ratingControlTester, RatingControl)
        );
        return <JsonForms />;
      }}
      schema={ratingSchema}
      uischema={ratingUiSchema}
    />
  </Provider>
);