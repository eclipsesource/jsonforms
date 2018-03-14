/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { FieldProps, RankedTester } from '@jsonforms/core';
import { MaterialArrayControlRenderer, materialArrayControlTester } from './complex';
import { MaterialLabelRenderer, materialLabelRendererTester } from './additional';
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
  MaterialCategorizationLayout,
  materialCategorizationTester,
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
  { tester: materialVerticalLayoutTester, renderer: MaterialVerticalLayout },
  { tester: materialCategorizationTester, renderer: MaterialCategorizationLayout },
  // additional
  { tester: materialLabelRendererTester, renderer: MaterialLabelRenderer }
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
