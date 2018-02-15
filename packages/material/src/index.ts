import { FieldProps, RankedTester } from '@jsonforms/core';
import { MaterialArrayControlRenderer, materialArrayControlTester } from './complex';
import {
  MaterialBooleanControl,
  materialBooleanControlTester,
  MaterialDateControl,
  materialDateControlTester,
  MaterialDateTimeControl,
  materialDateTimeControlTester,
  MaterialInputControl,
  materialInputControlTester,
  MaterialNativeControl,
  materialNativeControlTester,
} from './controls';
import {
  MaterialGroupLayout,
  materialGroupTester,
  MaterialHorizontalLayout,
  materialHorizontalLayoutTester,
  MaterialVerticalLayout,
  materialVerticalLayoutTester
} from './layouts';
import {
  MaterialBooleanField,
  materialBooleanFieldTester,
  MaterialDateField,
  materialDateFieldTester,
  MaterialEnumField,
  materialEnumFieldTester,
  MaterialIntegerField,
  materialIntegerFieldTester,
  MaterialNumberField,
  materialNumberFieldTester,
  MaterialNumberFormatField,
  materialNumberFormatFieldTester,
  MaterialSliderField,
  materialSliderFieldTester,
  MaterialTextField,
  materialTextFieldTester,
  MaterialTimeField,
  materialTimeFieldTester
} from './fields';
import { ComponentType } from 'react';

export * from './complex';
export * from './controls';
export * from './layouts';
export * from './fields';

export const materialRenderers = [
  // controls
  { tester: materialArrayControlTester, renderer: MaterialArrayControlRenderer },
  { tester: materialBooleanControlTester, renderer: MaterialBooleanControl },
  { tester: materialNativeControlTester, renderer: MaterialNativeControl },
  { tester: materialInputControlTester, renderer: MaterialInputControl },
  { tester: materialDateTimeControlTester, renderer: MaterialDateTimeControl },
  { tester: materialDateControlTester, renderer: MaterialDateControl },
  // layouts
  { tester: materialGroupTester, renderer: MaterialGroupLayout },
  { tester: materialHorizontalLayoutTester, renderer: MaterialHorizontalLayout },
  { tester: materialVerticalLayoutTester, renderer: MaterialVerticalLayout }
];

export const materialFields: { tester: RankedTester, field: ComponentType<FieldProps> }[] = [
  { tester: materialBooleanFieldTester, field: MaterialBooleanField },
  { tester: materialDateFieldTester, field: MaterialDateField },
  { tester: materialEnumFieldTester, field: MaterialEnumField },
  { tester: materialIntegerFieldTester, field: MaterialIntegerField },
  { tester: materialNumberFieldTester, field: MaterialNumberField },
  { tester: materialNumberFormatFieldTester, field: MaterialNumberFormatField },
  { tester: materialSliderFieldTester, field: MaterialSliderField },
  { tester: materialTextFieldTester, field: MaterialTextField },
  { tester: materialTimeFieldTester, field: MaterialTimeField },
];
