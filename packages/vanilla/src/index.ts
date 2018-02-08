import {
  DispatchPropsOfControl,
  FieldProps,
  RankedTester,
  StatePropsOfControl,
  StatePropsOfRenderer
} from '@jsonforms/core';
import { ComponentType } from 'react';

import {
  BooleanField,
  booleanFieldTester,
  DateField,
  dateFieldTester,
  EnumField,
  enumFieldTester,
  IntegerField,
  integerFieldTester,
  NumberField,
  numberFieldTester,
  SliderField,
  sliderFieldTester,
  TextAreaField,
  textAreaFieldTester,
  TextField,
  textFieldTester,
  TimeField,
  timeFieldTester
} from './fields';

import {
  InputControl,
  inputControlTester
} from './controls';

import {
  ArrayControl,
  arrayControlTester,
  Categorization,
  categorizationTester,
  LabelRenderer,
  labelRendererTester,
  TableArrayControl,
  tableArrayControlTester
} from './complex';

import {
  GroupLayout,
  groupTester,
  HorizontalLayout,
  horizontalLayoutTester,
  VerticalLayout,
  verticalLayoutTester
} from './layouts';

/**
 * Additional renderer props specific to vanilla renderers.
 */
export interface VanillaRendererProps {
  /**
   * Returns all classes associated with the given style.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyle(string: string, ...args: any[]): string[];

  /**
   * Returns all classes associated with the given style as a single class name.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyleAsClassName(string: string, ...args: any[]): string;
}

/**
 * Vanilla specific state-related control props.
 */
export interface VanillaControlStateProps extends StatePropsOfControl, VanillaRendererProps {
  classNames: {
    wrapper: string;
    input: string;
    label: string;
    description: string;
  };
}

/**
 * Vanilla specific control props.
 */
export interface VanillaControlProps extends VanillaControlStateProps, DispatchPropsOfControl {

}

/**
 * Vanilla specific layout props.
 */
export interface VanillaLayoutProps extends StatePropsOfRenderer, VanillaRendererProps {

}

export * from './controls';
export * from './complex';
export * from './fields';
export * from './layouts';

export const vanillaRenderers = [
  { tester: inputControlTester, renderer: InputControl },
  { tester: arrayControlTester, renderer: ArrayControl },
  { tester: labelRendererTester, renderer: LabelRenderer },
  { tester: categorizationTester, renderer: Categorization },
  { tester: tableArrayControlTester, renderer: TableArrayControl },
  { tester: groupTester, renderer: GroupLayout },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: horizontalLayoutTester, renderer: HorizontalLayout }
];

export const vanillaFields: { tester: RankedTester; field: ComponentType<FieldProps> }[] = [
  { tester: booleanFieldTester, field: BooleanField },
  { tester: dateFieldTester, field: DateField },
  { tester: enumFieldTester, field: EnumField },
  { tester: integerFieldTester, field: IntegerField },
  { tester: numberFieldTester, field: NumberField },
  { tester: sliderFieldTester, field: SliderField },
  { tester: textAreaFieldTester, field: TextAreaField },
  { tester: textFieldTester, field: TextField },
  { tester: timeFieldTester, field: TimeField }
];
