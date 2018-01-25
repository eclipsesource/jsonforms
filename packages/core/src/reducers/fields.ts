import { JsonFormsFieldConstructable } from '../util/field';
import { RankedTester } from '../testers';
import { ADD_FIELD, REMOVE_FIELD } from '../actions';

export const fieldReducer = (
  state: { tester: RankedTester, field: JsonFormsFieldConstructable }[] = [],
  { type, tester, field }) => {
  switch (type) {
    case ADD_FIELD:
      return state.concat([{ tester, field }]);
    case REMOVE_FIELD:
      return state.filter(t => t.tester !== tester);
    default:
      return state;
  }
};
