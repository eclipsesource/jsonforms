import { RankedTester } from '../testers';
import { ADD_RENDERER, REMOVE_RENDERER } from '../actions';
import { Renderer } from '../renderers';

export const rendererReducer = (
  state: { tester: RankedTester, renderer: Renderer }[] = [],
  {type, tester, renderer}) => {
  switch (type) {
    case ADD_RENDERER:
      return state.concat([{tester, renderer}]);
    case REMOVE_RENDERER:
      return state.filter(t => t.tester !== tester);
    default:
      return state;
  }
};
