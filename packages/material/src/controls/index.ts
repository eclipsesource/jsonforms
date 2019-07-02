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
import MaterialBooleanControl, {
  materialBooleanControlTester,
  MaterialBooleanControl as MaterialBooleanControlUnwrapped
} from './MaterialBooleanControl';
import MaterialEnumControl, {
  materialEnumControlTester,
  MaterialEnumControl as MaterialEnumControlUnwrapped
} from './MaterialEnumControl';
import MaterialNativeControl, {
  materialNativeControlTester,
  MaterialNativeControl as MaterialNativeControlUnwrapped
} from './MaterialNativeControl';
import MaterialDateControl, {
  materialDateControlTester,
  MaterialDateControl as MaterialDateControlUnwrapped
} from './MaterialDateControl';
import MaterialDateTimeControl, {
  materialDateTimeControlTester,
  MaterialDateTimeControl as MaterialDateTimeControlUnwrapped
} from './MaterialDateTimeControl';
import MaterialSliderControl, {
  materialSliderControlTester,
  MaterialSliderControl as MaterialSliderControlUnwrapped
} from './MaterialSliderControl';
import MaterialRadioGroupControl, {
  materialRadioGroupControlTester,
  MaterialRadioGroupControl as MaterialRadioGroupControlUnwrapped
} from './MaterialRadioGroupControl';
import MaterialIntegerControl, {
  materialIntegerControlTester,
  MaterialIntegerControl as MaterialIntegerControlUnwrapped
} from './MaterialIntegerControl';
import MaterialNumberControl, {
  materialNumberControlTester,
  MaterialNumberControl as MaterialNumberControlUnwrapped
} from './MaterialNumberControl';
import MaterialTextControl, {
  materialTextControlTester,
  MaterialTextControl as MaterialTextControlUnwrapped
} from './MaterialTextControl';

import MaterialAnyOfStringOrEnumControl, {
  materialAnyOfStringOrEnumControlTester,
  MaterialAnyOfStringOrEnumControl as MaterialAnyOfStringOrEnumControlUnwrapped
} from './MaterialAnyOfStringOrEnumControl';

export const Unwrapped = {
  MaterialBooleanControl: MaterialBooleanControlUnwrapped,
  MaterialEnumControl: MaterialEnumControlUnwrapped,
  MaterialNativeControl: MaterialNativeControlUnwrapped,
  MaterialDateControl: MaterialDateControlUnwrapped,
  MaterialDateTimeControl: MaterialDateTimeControlUnwrapped,
  MaterialSliderControl: MaterialSliderControlUnwrapped,
  MaterialRadioGroupControl: MaterialRadioGroupControlUnwrapped,
  MaterialIntegerControl: MaterialIntegerControlUnwrapped,
  MaterialNumberControl: MaterialNumberControlUnwrapped,
  MaterialTextControl: MaterialTextControlUnwrapped,
  MaterialAnyOfStringOrEnumControl: MaterialAnyOfStringOrEnumControlUnwrapped
};

export {
  MaterialBooleanControl,
  materialBooleanControlTester,
  MaterialEnumControl,
  materialEnumControlTester,
  MaterialNativeControl,
  materialNativeControlTester,
  MaterialDateControl,
  materialDateControlTester,
  MaterialDateTimeControl,
  materialDateTimeControlTester,
  MaterialSliderControl,
  materialSliderControlTester,
  MaterialRadioGroupControl,
  materialRadioGroupControlTester,
  MaterialIntegerControl,
  materialIntegerControlTester,
  MaterialNumberControl,
  materialNumberControlTester,
  MaterialTextControl,
  materialTextControlTester,
  MaterialAnyOfStringOrEnumControl,
  materialAnyOfStringOrEnumControlTester
};
