/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import 'hammerjs';
import { RankedTester } from '@jsonforms/core';
export * from './module';
import {
  BooleanControlRenderer,
  booleanControlTester,
} from './controls/boolean.renderer';
import {
  TextControlRenderer,
  TextControlRendererTester,
} from './controls/text.renderer';
import {
  TextAreaRenderer,
  TextAreaRendererTester,
} from './controls/textarea.renderer';
import {
  NumberControlRenderer,
  NumberControlRendererTester,
} from './controls/number.renderer';
import {
  RangeControlRenderer,
  RangeControlRendererTester,
} from './controls/range.renderer';
import {
  DateControlRenderer,
  DateControlRendererTester,
} from './controls/date.renderer';
import {
  ToggleControlRenderer,
  ToggleControlRendererTester,
} from './controls/toggle.renderer';
import {
  AutocompleteControlRenderer,
  enumControlTester,
} from './controls/autocomplete.renderer';
import {
  ObjectControlRenderer,
  ObjectControlRendererTester,
} from './other/object.renderer';
import {
  VerticalLayoutRenderer,
  verticalLayoutTester,
} from './layouts/vertical-layout.renderer';
import {
  HorizontalLayoutRenderer,
  horizontalLayoutTester,
} from './layouts/horizontal-layout.renderer';

import {
  CategorizationTabLayoutRenderer,
  categorizationTester,
} from './layouts/categorization-layout.renderer';

import { LabelRenderer, LabelRendererTester } from './other/label.renderer';
import {
  masterDetailTester,
  MasterListComponent,
} from './other/master-detail/master';
import {
  GroupLayoutRenderer,
  groupLayoutTester,
} from './layouts/group-layout.renderer';
import { TableRenderer, TableRendererTester } from './other/table.renderer';
import {
  ArrayLayoutRenderer,
  ArrayLayoutRendererTester,
} from './layouts/array-layout.renderer';

export * from './controls';
export * from './layouts';
export * from './other';

export const angularMaterialRenderers: {
  tester: RankedTester;
  renderer: any;
}[] = [
  // controls
  { tester: booleanControlTester, renderer: BooleanControlRenderer },
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
  { tester: TextAreaRendererTester, renderer: TextAreaRenderer },
  { tester: NumberControlRendererTester, renderer: NumberControlRenderer },
  { tester: RangeControlRendererTester, renderer: RangeControlRenderer },
  { tester: DateControlRendererTester, renderer: DateControlRenderer },
  { tester: ToggleControlRendererTester, renderer: ToggleControlRenderer },
  { tester: enumControlTester, renderer: AutocompleteControlRenderer },
  { tester: ObjectControlRendererTester, renderer: ObjectControlRenderer },
  // layouts
  { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  { tester: groupLayoutTester, renderer: GroupLayoutRenderer },
  { tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer },
  { tester: categorizationTester, renderer: CategorizationTabLayoutRenderer },
  { tester: LabelRendererTester, renderer: LabelRenderer },
  { tester: ArrayLayoutRendererTester, renderer: ArrayLayoutRenderer },
  // other
  { tester: masterDetailTester, renderer: MasterListComponent },
  { tester: TableRendererTester, renderer: TableRenderer },
];
