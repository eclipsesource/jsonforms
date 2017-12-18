import { registerStartupRenderer } from '@jsonforms/core';
import TreeRenderer from './TreeRenderer';
import { treeMasterDetailTester } from './tester';

export default registerStartupRenderer(
  treeMasterDetailTester,
  TreeRenderer
);
