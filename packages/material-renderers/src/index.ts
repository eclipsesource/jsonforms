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
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import {
  materialAllOfControlTester,
  MaterialAllOfRenderer,
  materialAnyOfControlTester,
  MaterialAnyOfRenderer,
  MaterialArrayControlRenderer,
  materialArrayControlTester,
  materialObjectControlTester,
  MaterialObjectRenderer,
  materialOneOfControlTester,
  MaterialOneOfRenderer,
  MaterialEnumArrayRenderer,
  materialEnumArrayRendererTester,
} from './complex';
import {
  MaterialLabelRenderer,
  materialLabelRendererTester,
  MaterialListWithDetailRenderer,
  materialListWithDetailTester,
} from './additional';
import {
  MaterialAnyOfStringOrEnumControl,
  materialAnyOfStringOrEnumControlTester,
  MaterialBooleanControl,
  materialBooleanControlTester,
  MaterialBooleanToggleControl,
  materialBooleanToggleControlTester,
  MaterialDateControl,
  materialDateControlTester,
  MaterialDateTimeControl,
  materialDateTimeControlTester,
  MaterialTimeControl,
  materialTimeControlTester,
  MaterialEnumControl,
  materialEnumControlTester,
  MaterialIntegerControl,
  materialIntegerControlTester,
  MaterialNativeControl,
  materialNativeControlTester,
  MaterialNumberControl,
  materialNumberControlTester,
  MaterialOneOfEnumControl,
  materialOneOfEnumControlTester,
  MaterialRadioGroupControl,
  materialRadioGroupControlTester,
  MaterialSliderControl,
  materialSliderControlTester,
  MaterialTextControl,
  materialTextControlTester,
  MaterialOneOfRadioGroupControl,
  materialOneOfRadioGroupControlTester,
} from './controls';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester,
  MaterialCategorizationLayout,
  materialCategorizationTester,
  MaterialGroupLayout,
  materialGroupTester,
  MaterialHorizontalLayout,
  materialHorizontalLayoutTester,
  MaterialVerticalLayout,
  materialVerticalLayoutTester,
} from './layouts';
import {
  MaterialBooleanCell,
  materialBooleanCellTester,
  MaterialBooleanToggleCell,
  materialBooleanToggleCellTester,
  MaterialDateCell,
  materialDateCellTester,
  MaterialEnumCell,
  materialEnumCellTester,
  MaterialIntegerCell,
  materialIntegerCellTester,
  MaterialNumberCell,
  materialNumberCellTester,
  MaterialNumberFormatCell,
  materialNumberFormatCellTester,
  MaterialOneOfEnumCell,
  materialOneOfEnumCellTester,
  MaterialTextCell,
  materialTextCellTester,
  MaterialTimeCell,
  materialTimeCellTester,
} from './cells';
import MaterialCategorizationStepperLayout, {
  materialCategorizationStepperTester,
} from './layouts/MaterialCategorizationStepperLayout';

export * from './additional';
export * from './cells';
export * from './complex';
export * from './controls';
export * from './layouts';
export * from './mui-controls';
export * from './util';

export const materialRenderers: JsonFormsRendererRegistryEntry[] = [
  // controls
  {
    tester: materialArrayControlTester,
    renderer: MaterialArrayControlRenderer,
  },
  { tester: materialBooleanControlTester, renderer: MaterialBooleanControl },
  {
    tester: materialBooleanToggleControlTester,
    renderer: MaterialBooleanToggleControl,
  },
  { tester: materialNativeControlTester, renderer: MaterialNativeControl },
  { tester: materialEnumControlTester, renderer: MaterialEnumControl },
  { tester: materialIntegerControlTester, renderer: MaterialIntegerControl },
  { tester: materialNumberControlTester, renderer: MaterialNumberControl },
  { tester: materialTextControlTester, renderer: MaterialTextControl },
  { tester: materialDateTimeControlTester, renderer: MaterialDateTimeControl },
  { tester: materialDateControlTester, renderer: MaterialDateControl },
  { tester: materialTimeControlTester, renderer: MaterialTimeControl },
  { tester: materialSliderControlTester, renderer: MaterialSliderControl },
  { tester: materialObjectControlTester, renderer: MaterialObjectRenderer },
  { tester: materialAllOfControlTester, renderer: MaterialAllOfRenderer },
  { tester: materialAnyOfControlTester, renderer: MaterialAnyOfRenderer },
  { tester: materialOneOfControlTester, renderer: MaterialOneOfRenderer },
  {
    tester: materialRadioGroupControlTester,
    renderer: MaterialRadioGroupControl,
  },
  {
    tester: materialOneOfRadioGroupControlTester,
    renderer: MaterialOneOfRadioGroupControl,
  },
  {
    tester: materialOneOfEnumControlTester,
    renderer: MaterialOneOfEnumControl,
  },
  // layouts
  { tester: materialGroupTester, renderer: MaterialGroupLayout },
  {
    tester: materialHorizontalLayoutTester,
    renderer: MaterialHorizontalLayout,
  },
  { tester: materialVerticalLayoutTester, renderer: MaterialVerticalLayout },
  {
    tester: materialCategorizationTester,
    renderer: MaterialCategorizationLayout,
  },
  {
    tester: materialCategorizationStepperTester,
    renderer: MaterialCategorizationStepperLayout,
  },
  { tester: materialArrayLayoutTester, renderer: MaterialArrayLayout },
  // additional
  { tester: materialLabelRendererTester, renderer: MaterialLabelRenderer },
  {
    tester: materialListWithDetailTester,
    renderer: MaterialListWithDetailRenderer,
  },
  {
    tester: materialAnyOfStringOrEnumControlTester,
    renderer: MaterialAnyOfStringOrEnumControl,
  },
  {
    tester: materialEnumArrayRendererTester,
    renderer: MaterialEnumArrayRenderer,
  },
];

export const materialCells: JsonFormsCellRendererRegistryEntry[] = [
  { tester: materialBooleanCellTester, cell: MaterialBooleanCell },
  { tester: materialBooleanToggleCellTester, cell: MaterialBooleanToggleCell },
  { tester: materialDateCellTester, cell: MaterialDateCell },
  { tester: materialEnumCellTester, cell: MaterialEnumCell },
  { tester: materialIntegerCellTester, cell: MaterialIntegerCell },
  { tester: materialNumberCellTester, cell: MaterialNumberCell },
  { tester: materialNumberFormatCellTester, cell: MaterialNumberFormatCell },
  { tester: materialOneOfEnumCellTester, cell: MaterialOneOfEnumCell },
  { tester: materialTextCellTester, cell: MaterialTextCell },
  { tester: materialTimeCellTester, cell: MaterialTimeCell },
];

import { UnwrappedAdditional } from './additional/unwrapped';
import { UnwrappedComplex } from './complex/unwrapped';
import { UnwrappedControls } from './controls/unwrapped';
import { UnwrappedLayouts } from './layouts/unwrapped';

export const Unwrapped = {
  ...UnwrappedAdditional,
  ...UnwrappedComplex,
  ...UnwrappedControls,
  ...UnwrappedLayouts,
};
