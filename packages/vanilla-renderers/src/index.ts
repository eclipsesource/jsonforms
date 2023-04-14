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
import { RankedTester } from '@jsonforms/core';

import {
  BooleanCell,
  booleanCellTester,
  DateCell,
  dateCellTester,
  dateTimeCellTester,
  EnumCell,
  enumCellTester,
  IntegerCell,
  integerCellTester,
  NumberCell,
  numberCellTester,
  SliderCell,
  sliderCellTester,
  TextAreaCell,
  textAreaCellTester,
  TextCell,
  textCellTester,
  TimeCell,
  timeCellTester,
} from './cells';

import {
  InputControl,
  inputControlTester,
  RadioGroupControl,
  radioGroupControlTester,
  OneOfRadioGroupControl,
  oneOfRadioGroupControlTester,
} from './controls';

import {
  ArrayControl,
  arrayControlTester,
  Categorization,
  categorizationTester,
  LabelRenderer,
  labelRendererTester,
  TableArrayControl,
  tableArrayControlTester,
} from './complex';

import {
  GroupLayout,
  groupTester,
  HorizontalLayout,
  horizontalLayoutTester,
  VerticalLayout,
  verticalLayoutTester,
} from './layouts';
import DateTimeCell from './cells/DateTimeCell';

export interface WithClassname {
  className?: string;
}

/**
 * Additional renderer props specific to vanilla renderers.
 */
export interface VanillaRendererProps extends WithClassname {
  classNames?: { [className: string]: string };
  /**
   * Returns all classes associated with the given style.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyle?(string: string, ...args: any[]): string[];

  /**
   * Returns all classes associated with the given style as a single class name.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyleAsClassName?(string: string, ...args: any[]): string;
}

export interface WithChildren {
  children: any;
}

export * from './actions';
export * from './controls';
export * from './complex';
export * from './cells';
export * from './layouts';
export * from './reducers';
export * from './util';
export * from './styles';

export const vanillaRenderers: { tester: RankedTester; renderer: any }[] = [
  { tester: inputControlTester, renderer: InputControl },
  { tester: radioGroupControlTester, renderer: RadioGroupControl },
  { tester: oneOfRadioGroupControlTester, renderer: OneOfRadioGroupControl },
  { tester: arrayControlTester, renderer: ArrayControl },
  { tester: labelRendererTester, renderer: LabelRenderer },
  { tester: categorizationTester, renderer: Categorization },
  { tester: tableArrayControlTester, renderer: TableArrayControl },
  { tester: groupTester, renderer: GroupLayout },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: horizontalLayoutTester, renderer: HorizontalLayout },
];

export const vanillaCells: { tester: RankedTester; cell: any }[] = [
  { tester: booleanCellTester, cell: BooleanCell },
  { tester: dateCellTester, cell: DateCell },
  { tester: dateTimeCellTester, cell: DateTimeCell },
  { tester: enumCellTester, cell: EnumCell },
  { tester: integerCellTester, cell: IntegerCell },
  { tester: numberCellTester, cell: NumberCell },
  { tester: sliderCellTester, cell: SliderCell },
  { tester: textAreaCellTester, cell: TextAreaCell },
  { tester: textCellTester, cell: TextCell },
  { tester: timeCellTester, cell: TimeCell },
];
