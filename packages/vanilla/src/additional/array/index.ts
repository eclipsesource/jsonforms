import {
  isArrayObjectControl,
  rankWith,
  registerStartupRenderer,
} from '@jsonforms/core';
import ArrayControlRenderer from './ArrayControlRenderer';
import { ArrayControl } from './ArrayControl';

export {
  ArrayControl,
  ArrayControlRenderer
};

export default registerStartupRenderer(
  rankWith(2, isArrayObjectControl),
  ArrayControlRenderer
);
