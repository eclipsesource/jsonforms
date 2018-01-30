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

registerStartupRenderer(
  rankWith(2, isArrayObjectControl),
  ArrayControlRenderer
);

export default ArrayControlRenderer;
