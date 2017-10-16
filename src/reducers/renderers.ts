import { JsonFormsRendererConstructable } from '../renderers/renderer.util';
import { RankedTester } from '../core/testers';
import { ADD_RENDERER } from '../actions';

export const rendererReducer = (
  state: { tester: RankedTester, renderer: JsonFormsRendererConstructable }[] = [],
  {type, tester, renderer}) => {
  switch (type) {
    case ADD_RENDERER:
      return state.concat([{tester, renderer}]);
    default:
      return state;
  }
};
