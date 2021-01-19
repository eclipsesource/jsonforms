import * as React from 'react';
import { Rating } from './Rating';
import { withJsonFormsControlProps } from '@jsonforms/react';

const RatingControl = ({ data, handleChange, path }) => (
  <Rating value={data} onClick={(ev) => handleChange(path, Number(ev.value))} />
);

export default withJsonFormsControlProps(RatingControl);
