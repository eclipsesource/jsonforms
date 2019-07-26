import React from 'react';
import { day3 } from '@jsonforms/examples';
import { registerRenderer } from '@jsonforms/core';
import { JsonFormsDispatch, JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { Demo } from '../common';
import { createJsonFormsStore } from '../../common/store';
import ratingControlTester from '../common/ratingControlTester';
import RatingControl from '../common/RatingControl';
import { Link } from 'docz';

const CustomControlsExample = () => {
  const store = createJsonFormsStore({
    data: day3.data,
    schema: day3.schema,
    uischema: day3.uischema
  });

  store.dispatch(registerRenderer(ratingControlTester, RatingControl));

  return (
    <Provider store={store}>
      <JsonFormsReduxContext>
        <Demo
          schema={day3.schema}
          uischema={day3.uischema}
          js={() => <JsonFormsDispatch />}
        />
      </JsonFormsReduxContext>
    </Provider>
  );
};

export default CustomControlsExample;
