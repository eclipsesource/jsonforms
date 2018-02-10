import { RankedTester } from '@jsonforms/core';
export * from './module';
import { TextControlRenderer, TextControlRendererTester } from './controls/text.renderer';
import { VerticalLayoutRenderer, verticalLayoutTester } from './layouts/vertical-layout.renderer';

export const angularMaterialRenderers:
    { tester: RankedTester, renderer: any }[]  = [
    // controls
    { tester: TextControlRendererTester, renderer: TextControlRenderer },
    // layouts
    { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  ];
