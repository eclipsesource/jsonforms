import React from 'react';
import { day3 } from '@jsonforms/examples';

import { Demo } from '../common';
import ratingControlTester from '../common/rating/ratingControlTester';
import RatingControl from '../common/rating/RatingControl';
import { materialRenderers } from '@jsonforms/material-renderers';

const CustomControlsExample = () => {
  return (
    <Demo
      schema={day3.schema}
      uischema={day3.uischema}
      data={day3.data}
      renderers={[
        ...materialRenderers,
        { renderer: RatingControl, tester: ratingControlTester },
      ]}
    />
  );
};

export default CustomControlsExample;
