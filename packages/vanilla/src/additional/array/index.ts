import {
  registerStartupRenderer,
} from '@jsonforms/core';
import ArrayControlRenderer from './ArrayControlRenderer';
import { arrayTester } from './tester';

export default registerStartupRenderer(
  arrayTester,
  ArrayControlRenderer
);
