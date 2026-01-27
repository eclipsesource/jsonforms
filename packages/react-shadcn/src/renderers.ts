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

import type {
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
} from '@jsonforms/core';

import ShadcnTextControl, {
  shadcnTextControlTester,
} from './controls/ShadcnTextControl';
import ShadcnNumberControl, {
  shadcnNumberControlTester,
} from './controls/ShadcnNumberControl';
import ShadcnBooleanControl, {
  shadcnBooleanControlTester,
} from './controls/ShadcnBooleanControl';
import ShadcnEnumControl, {
  shadcnEnumControlTester,
} from './controls/ShadcnEnumControl';
import ShadcnTextAreaControl, {
  shadcnTextAreaControlTester,
} from './controls/ShadcnTextAreaControl';
import RadioGroupControl, {
  radioGroupControlTester,
} from './controls/RadioGroupControl';
import OneOfRadioGroupControl, {
  oneOfRadioGroupControlTester,
} from './controls/OneOfRadioGroupControl';
import InputControl, {
  inputControlTester,
} from './controls/InputControl';
import TextCell, { textCellTester } from './cells/TextCell';
import NumberCell, { numberCellTester } from './cells/NumberCell';
import BooleanCell, { booleanCellTester } from './cells/BooleanCell';
import EnumCell, { enumCellTester } from './cells/EnumCell';
import TextAreaCell, { textAreaCellTester } from './cells/TextAreaCell';
import DateCell, { dateCellTester } from './cells/DateCell';
import DateTimeCell, { dateTimeCellTester } from './cells/DateTimeCell';
import TimeCell, { timeCellTester } from './cells/TimeCell';
import IntegerCell, { integerCellTester } from './cells/IntegerCell';
import OneOfEnumCell, { oneOfEnumCellTester } from './cells/OneOfEnumCell';
import SliderCell, { sliderCellTester } from './cells/SliderCell';
import NumberFormatCell, { numberFormatCellTester } from './cells/NumberFormatCell';
import VerticalLayout, { verticalLayoutTester } from './layouts/VerticalLayout';
import HorizontalLayout, { horizontalLayoutTester } from './layouts/HorizontalLayout';
import GroupLayout, { groupLayoutTester } from './layouts/GroupLayout';
import LabelRenderer, { labelRendererTester } from './complex/LabelRenderer';
import ArrayControlRenderer, { arrayControlTester } from './complex/array';
import TableArrayControl, { tableArrayControlTester } from './complex/TableArrayControl';
import CategorizationRenderer, { categorizationTester } from './complex/categorization';
import ObjectRenderer, { objectRendererTester } from './complex/ObjectRenderer';
// import ListWithDetailRenderer, { listWithDetailTester } from './complex/ListWithDetailRenderer'; // TEMPORARILY DISABLED

export const shadcnRenderers: JsonFormsRendererRegistryEntry[] = [
  { tester: shadcnBooleanControlTester, renderer: ShadcnBooleanControl },
  { tester: radioGroupControlTester, renderer: RadioGroupControl },
  { tester: oneOfRadioGroupControlTester, renderer: OneOfRadioGroupControl },
  { tester: shadcnEnumControlTester, renderer: ShadcnEnumControl },
  { tester: shadcnTextAreaControlTester, renderer: ShadcnTextAreaControl },
  { tester: shadcnNumberControlTester, renderer: ShadcnNumberControl },
  { tester: shadcnTextControlTester, renderer: ShadcnTextControl },
  { tester: objectRendererTester, renderer: ObjectRenderer },
  // { tester: listWithDetailTester, renderer: ListWithDetailRenderer }, // TEMPORARILY DISABLED
  { tester: arrayControlTester, renderer: ArrayControlRenderer },
  { tester: tableArrayControlTester, renderer: TableArrayControl },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: horizontalLayoutTester, renderer: HorizontalLayout },
  { tester: groupLayoutTester, renderer: GroupLayout },
  { tester: categorizationTester, renderer: CategorizationRenderer },
  { tester: labelRendererTester, renderer: LabelRenderer },
  // Fallback InputControl should be last (rank 1)
  { tester: inputControlTester, renderer: InputControl },
];

export const shadcnCells: JsonFormsCellRendererRegistryEntry[] = [
  { tester: booleanCellTester, cell: BooleanCell },
  { tester: enumCellTester, cell: EnumCell },
  { tester: textAreaCellTester, cell: TextAreaCell },
  { tester: numberFormatCellTester, cell: NumberFormatCell },
  { tester: numberCellTester, cell: NumberCell },
  { tester: textCellTester, cell: TextCell },
  { tester: dateCellTester, cell: DateCell },
  { tester: dateTimeCellTester, cell: DateTimeCell },
  { tester: timeCellTester, cell: TimeCell },
  { tester: integerCellTester, cell: IntegerCell },
  { tester: oneOfEnumCellTester, cell: OneOfEnumCell },
  { tester: sliderCellTester, cell: SliderCell },
];
