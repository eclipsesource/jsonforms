import {
  isBooleanControl,
  isHorizontalLayout,
  isNumericControl,
  isStringControl,
  isVerticalLayout,
  or,
  rankWith,
} from '@jsonforms/core';
import type { RendererRegistryEntry } from '@jsonforms/react';
import { MaterialLayout } from './layouts/MaterialLayout';
import { MaterialBooleanControl } from './controls/MaterialBooleanControl';
import { MaterialNumberControl } from './controls/MaterialNumberControl';
import { MaterialStringControl } from './controls/MaterialStringControl';

export const materialLayoutTester = rankWith(
  1,
  or(isVerticalLayout, isHorizontalLayout),
);
export const materialStringControlTester = rankWith(1, isStringControl);
export const materialNumberControlTester = rankWith(1, isNumericControl);
export const materialBooleanControlTester = rankWith(1, isBooleanControl);

/** The default Material UI renderer registry. */
export const materialRenderers: readonly RendererRegistryEntry[] = [
  { tester: materialLayoutTester, renderer: MaterialLayout },
  { tester: materialStringControlTester, renderer: MaterialStringControl },
  { tester: materialNumberControlTester, renderer: MaterialNumberControl },
  { tester: materialBooleanControlTester, renderer: MaterialBooleanControl },
];
