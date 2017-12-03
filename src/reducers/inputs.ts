import { JsonFormsInputConstructable } from '../renderers/fields/field.util';
import { RankedTester } from '../core/testers';
import { ADD_INPUT, REMOVE_INPUT } from '../actions';

export const inputReducer = (
  state: { tester: RankedTester, input: JsonFormsInputConstructable }[] = [],
  { type, tester, input }) => {
  switch (type) {
    case ADD_INPUT:
      return state.concat([{ tester, input }]);
    case REMOVE_INPUT:
      return state.filter(t => t.tester !== tester);
    default:
      return state;
  }
};
