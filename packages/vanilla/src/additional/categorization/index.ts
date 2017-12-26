import { registerStartupRenderer } from '@jsonforms/core';
import CategorizationRenderer from './CategorizationRenderer';
import { categorizationTester } from './tester';
import { CategorizationList, CategorizationProps } from './CategorizationList';
import { SingleCategory } from './SingleCategory'

export {
  categorizationTester,
  CategorizationList,
  CategorizationProps,
  CategorizationRenderer,
  SingleCategory
};

export default registerStartupRenderer(
  categorizationTester,
  CategorizationRenderer
);
