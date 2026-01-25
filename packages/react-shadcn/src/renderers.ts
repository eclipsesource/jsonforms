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
import TextCell, { textCellTester } from './cells/TextCell';
import NumberCell, { numberCellTester } from './cells/NumberCell';
import BooleanCell, { booleanCellTester } from './cells/BooleanCell';
import EnumCell, { enumCellTester } from './cells/EnumCell';
import TextAreaCell, { textAreaCellTester } from './cells/TextAreaCell';
import VerticalLayout, { verticalLayoutTester } from './layouts/VerticalLayout';
import HorizontalLayout, { horizontalLayoutTester } from './layouts/HorizontalLayout';
import GroupLayout, { groupLayoutTester } from './layouts/GroupLayout';

export const shadcnRenderers: JsonFormsRendererRegistryEntry[] = [
  { tester: shadcnBooleanControlTester, renderer: ShadcnBooleanControl },
  { tester: shadcnEnumControlTester, renderer: ShadcnEnumControl },
  { tester: shadcnTextAreaControlTester, renderer: ShadcnTextAreaControl },
  { tester: shadcnNumberControlTester, renderer: ShadcnNumberControl },
  { tester: shadcnTextControlTester, renderer: ShadcnTextControl },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: horizontalLayoutTester, renderer: HorizontalLayout },
  { tester: groupLayoutTester, renderer: GroupLayout },
];

export const shadcnCells: JsonFormsCellRendererRegistryEntry[] = [
  { tester: booleanCellTester, cell: BooleanCell },
  { tester: enumCellTester, cell: EnumCell },
  { tester: textAreaCellTester, cell: TextAreaCell },
  { tester: numberCellTester, cell: NumberCell },
  { tester: textCellTester, cell: TextCell },
];
