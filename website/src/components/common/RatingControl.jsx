import * as React from 'react';
import { mapStateToControlProps, mapDispatchToControlProps } from '@jsonforms/core';
import { connect } from 'react-redux';
import { Rating } from './Rating';

const RatingControl = ({ data, handleChange, path }) => (
  <Rating
    value={data}
    onClick={ev => handleChange(path, Number(ev.value))}
  />
);

export default connect(
  mapStateToControlProps,
  mapDispatchToControlProps,
)(RatingControl);
