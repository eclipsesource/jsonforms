import {
  CoreActions,
  Dispatch,
  JsonFormsCore,
  JsonFormsSubStates
} from '@jsonforms/core';

export interface InjectJsonFormsState {
  jsonforms: JsonFormsSubStates;
}
export interface InjectJsonFormsDispatch {
  dispatch: Dispatch<CoreActions>
}

export type JsonFormsChangeEvent = Pick<JsonFormsCore, 'data' | 'errors'>
