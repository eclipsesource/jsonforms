import {
  registerStartupRenderer,
} from '@jsonforms/core';
import ArrayControlRenderer from './ArrayControlRenderer';
import { ArrayControl } from './ArrayControl';
import { arrayTester } from './tester';

export {
  arrayTester,
  ArrayControl,
  ArrayControlRenderer
};

export default registerStartupRenderer(
  arrayTester,
  ArrayControlRenderer
);
