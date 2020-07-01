import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  withIncreasedRank
} from '@jsonforms/core';
import { ExtendedUnwrapped } from '../src/extended';
import { materialAutocompleteOneOfEnumControlTester } from '../src/extended/MaterialAutocompleteOneOfEnumControl';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import React from 'react';
import Typography from '@material-ui/core/Typography';
export const MyAutocompleteControl = (props: ControlProps & OwnPropsOfEnum) => {
  return (
    <ExtendedUnwrapped.MaterialAutocompleteOneOfEnumControl
      {...props}
      renderOption={option => (<Typography>{`${option?.value}\t-\t${option?.label}`}</Typography>)}
      filterOptions={(options, state) => options.filter(o => o.label.includes(state.inputValue) || o.value.includes(state.inputValue))}
    />
  );
};

export const myAutocompleteTester: RankedTester = withIncreasedRank(
  1,
  materialAutocompleteOneOfEnumControlTester
);

export default withJsonFormsOneOfEnumProps(MyAutocompleteControl);
