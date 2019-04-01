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
import {
  BooleanToggleControlRenderer,
  booleanToggleControlTester
} from './controls/boolean/boolean-toggle-control';
import {
  StringControlRenderer,
  stringControlTester
} from './controls/string/string-control';
import {
  BooleanCheckboxControlRenderer,
  booleanControlTester
} from './controls/boolean/boolean-checkbox-control';
import {
  MultilineControlRenderer,
  multilineControlTester
} from './controls/string/multiline-control';
import {
  NumberControlRenderer,
  numberControlTester
} from './controls/number/number-control';
import {
  DateControlRenderer,
  dateControlTester
} from './controls/date/date-control';
import {
  EnumControlRenderer,
  enumControlTester
} from './controls/enum/enum-control';
import {
  RangeControlRenderer,
  rangeControlTester
} from './controls/range/range-control';
import { isEnumControl, rankWith } from '@jsonforms/core';
import { AutoCompleteControlRenderer } from './controls/enum/autocomplete-control';
import {
  HorizontalLayoutRenderer,
  horizontalLayoutTester
} from './layouts/horizontal/horizontal-layout';
import {
  VerticalLayoutRenderer,
  verticalLayoutTester
} from './layouts/vertical/vertical-layout';
import {
  CategorizationTabLayoutRenderer,
  categorizationTester
} from './layouts/categorization/categorization-tab-layout';
import { GroupLayoutRenderer, groupTester } from './layouts/group/group-layout';
import {
  ListWithDetailControl,
  listWithDetailTester
} from './other/list-with-detail/list-with-detail-control';
import { LabelRenderer, labelTester } from './other/label/label';
import {
  ObjectControlRenderer,
  objectControlTester
} from './controls/object/object.control';

export {
  booleanControlTester,
  BooleanCheckboxControlRenderer
} from './controls/boolean/boolean-checkbox-control';
export {
  booleanToggleControlTester,
  BooleanToggleControlRenderer
} from './controls/boolean/boolean-toggle-control';
export {
  stringControlTester,
  StringControlRenderer
} from './controls/string/string-control';
export {
  multilineControlTester,
  MultilineControlRenderer
} from './controls/string/multiline-control';
export {
  numberControlTester,
  NumberControlRenderer
} from './controls/number/number-control';
export {
  dateControlTester,
  DateControlRenderer
} from './controls/date/date-control';
export {
  enumControlTester,
  EnumControlRenderer
} from './controls/enum/enum-control';
export {
  rangeControlTester,
  RangeControlRenderer
} from './controls/range/range-control';
export {
  AutoCompleteControlRenderer
} from './controls/enum/autocomplete-control';

export {
  horizontalLayoutTester,
  HorizontalLayoutRenderer
} from './layouts/horizontal/horizontal-layout';
export {
  verticalLayoutTester,
  VerticalLayoutRenderer
} from './layouts/vertical/vertical-layout';
export {
  categorizationTester,
  CategorizationMenuLayoutRenderer
} from './layouts/categorization/categorization-menu-layout';
export {
  CategorizationTabLayoutRenderer
} from './layouts/categorization/categorization-tab-layout';
export { CategoryRenderer } from './layouts/categorization/category/category';
export { groupTester, GroupLayoutRenderer } from './layouts/group/group-layout';

export {
  listWithDetailTester,
  ListWithDetailControl
} from './other/list-with-detail/list-with-detail-control';
export { labelTester, LabelRenderer } from './other/label/label';

export { JsonFormsIonicModule } from './json-forms.module';

export const ionicRenderers: { tester: any; renderer: any }[] = [
  // controls
  { tester: booleanControlTester, renderer: BooleanCheckboxControlRenderer },
  {
    tester: booleanToggleControlTester,
    renderer: BooleanToggleControlRenderer
  },
  { tester: stringControlTester, renderer: StringControlRenderer },
  { tester: multilineControlTester, renderer: MultilineControlRenderer },
  { tester: numberControlTester, renderer: NumberControlRenderer },
  { tester: dateControlTester, renderer: DateControlRenderer },
  { tester: enumControlTester, renderer: EnumControlRenderer },
  { tester: rangeControlTester, renderer: RangeControlRenderer },
  { tester: rankWith(3, isEnumControl), renderer: AutoCompleteControlRenderer },
  { tester: objectControlTester, renderer: ObjectControlRenderer },

  // layouts
  { tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer },
  { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  { tester: categorizationTester, renderer: CategorizationTabLayoutRenderer },
  { tester: groupTester, renderer: GroupLayoutRenderer },

  // other
  { tester: listWithDetailTester, renderer: ListWithDetailControl },
  { tester: labelTester, renderer: LabelRenderer }
];
