import {
  isArrayObjectControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import ArrayControlRenderer from './ArrayControlRenderer';
import { ArrayControl } from './ArrayControl';

export {
  ArrayControl,
  ArrayControlRenderer
};

export const arrayControlTester: RankedTester = rankWith(2, isArrayObjectControl);

export default ArrayControlRenderer;
