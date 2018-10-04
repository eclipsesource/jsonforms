import * as _ from 'lodash';
import {
    ADD_UI_SCHEMA,
    AddUISchemaAction,
    REMOVE_UI_SCHEMA,
    RemoveUISchemaAction
} from '../actions';
import { JsonSchema, NOT_APPLICABLE, UISchemaElement } from '..';

export type UISchemaTester = (schema: JsonSchema, schemaPath: string, path: string) => number;

type ValidUISchemaReducerActions = AddUISchemaAction | RemoveUISchemaAction;

export const uischemaRegistryReducer = (
  state: { tester: UISchemaTester, uischema: UISchemaElement }[] = [],
  action: ValidUISchemaReducerActions) => {
  switch (action.type) {
    case ADD_UI_SCHEMA:
      return state.slice().concat({ tester: action.tester, uischema: action.uischema });
    case REMOVE_UI_SCHEMA:
      const copy = state.slice();
      _.remove(
        copy,
        entry => entry.tester === action.tester
      );
      return copy;
    default:
      return state;
  }
};

export const findMatchingUISchema =
  (state: { tester: UISchemaTester, uischema: UISchemaElement }[]) =>
    (jsonSchema: JsonSchema, schemaPath: string, path: string): UISchemaElement => {
      const match = _.maxBy(state, entry => entry.tester(jsonSchema, schemaPath, path));
      if (match !== undefined && match.tester(jsonSchema, schemaPath, path) !== NOT_APPLICABLE) {
        return match.uischema;
      }
      return undefined;
    };
