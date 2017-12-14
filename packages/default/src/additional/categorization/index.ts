import { registerStartupRenderer } from '@jsonforms/core';
import CategorizationRenderer from './CategorizationRenderer';
import { categorizationTester } from './tester';

export default registerStartupRenderer(
  categorizationTester,
  CategorizationRenderer
);
