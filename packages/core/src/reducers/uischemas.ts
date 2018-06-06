import * as _ from 'lodash';
import { ADD_UI_SCHEMA, REMOVE_UI_SCHEMA } from '../actions';
import { JsonSchema, UISchemaElement } from '..';

export type UISchemaTester = (schema: JsonSchema, schemaPath: string, path: string) => number;

export const uischemaRegistryReducer = (
  state: { tester: UISchemaTester, uischema: UISchemaElement }[] = [],
  action) => {
  switch (action.type) {
    case ADD_UI_SCHEMA:
      return state.slice().concat({ tester: action.tester, uischema: action.uischema });
    case REMOVE_UI_SCHEMA:
      const copy = state.slice();
      _.remove(
        copy,
        entry => entry.tester === action.tester && _.eq(entry.uischema, action.uischema)
      );
      return copy;
    default:
      return state;
  }
};

export const findMatchingUISchema =
  state =>
  (jsonSchema: JsonSchema, schemaPath: string, path: string): UISchemaElement => {
  const match = _.find(state, entry => entry.tester(jsonSchema, schemaPath, path));
  if (match) {
    return match.uischema;
  }
  return undefined;
};
