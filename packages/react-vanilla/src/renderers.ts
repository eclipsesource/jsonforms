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
import { VanillaLayout } from './layouts/VanillaLayout';
import { VanillaBooleanControl } from './controls/VanillaBooleanControl';
import { VanillaNumberControl } from './controls/VanillaNumberControl';
import { VanillaStringControl } from './controls/VanillaStringControl';

export const vanillaLayoutTester = rankWith(
  1,
  or(isVerticalLayout, isHorizontalLayout),
);
export const vanillaStringControlTester = rankWith(1, isStringControl);
export const vanillaNumberControlTester = rankWith(1, isNumericControl);
export const vanillaBooleanControlTester = rankWith(1, isBooleanControl);

/** The default plain-HTML renderer registry. */
export const vanillaRenderers: readonly RendererRegistryEntry[] = [
  { tester: vanillaLayoutTester, renderer: VanillaLayout },
  { tester: vanillaStringControlTester, renderer: VanillaStringControl },
  { tester: vanillaNumberControlTester, renderer: VanillaNumberControl },
  { tester: vanillaBooleanControlTester, renderer: VanillaBooleanControl },
];
