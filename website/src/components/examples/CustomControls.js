import React from 'react';
import { defaultExample } from '@jsonforms/examples';

import { Demo } from '../common/Demo';
import ratingControlTester from '../common/rating/ratingControlTester';
import RatingControl from '../common/rating/RatingControl';
import { materialRenderers } from '@jsonforms/material-renderers';

const CustomControlsExample = () => {
  return (
    <Demo
      schema={defaultExample.schema}
      uischema={defaultExample.uischema}
      data={defaultExample.data}
      renderers={[
        ...materialRenderers,
        { renderer: RatingControl, tester: ratingControlTester },
      ]}
    />
  );
};

export default CustomControlsExample;
