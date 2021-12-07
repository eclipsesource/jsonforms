import {
  AnyAction, 
  ControlProps,
  Dispatch,
  OwnPropsOfEnum,
  RankedTester,
  withIncreasedRank,
  Actions
} from '@jsonforms/core';
import { ExtendedUnwrapped } from '../src/extended';
import { materialAutocompleteOneOfEnumControlTester } from '../src/extended/MaterialAutocompleteOneOfEnumControl';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import React from 'react';
import { Typography } from '@mui/material';
const MyAutocompleteControl = (props: ControlProps & OwnPropsOfEnum) => {
  return (
    <ExtendedUnwrapped.MaterialAutocompleteOneOfEnumControl
      {...props}
      renderOption={({}, option) => (<Typography>{`${option?.value}\t-\t${option?.label}`}</Typography>)}
      filterOptions={(options, state) => options.filter(o => o.label.includes(state.inputValue) || o.value.includes(state.inputValue))}
    />
  );
};

const myAutocompleteTester: RankedTester = withIncreasedRank(
  1,
  materialAutocompleteOneOfEnumControlTester
);

const ConnectedControl = withJsonFormsOneOfEnumProps(MyAutocompleteControl);


export const ExampleExtension = (dispatch: Dispatch<AnyAction>) => (
  <div>
    <button
      onClick={() =>
        dispatch(
          Actions.registerRenderer(myAutocompleteTester, ConnectedControl)
        )
      }
    >
      Register Custom OneOf Autocomplete
    </button>
    <button
      onClick={() =>
        dispatch(
          Actions.unregisterRenderer(myAutocompleteTester, ConnectedControl)
        )
      }
    >
      Unregister Custom OneOf Autocomplete
    </button>
  </div>
);
