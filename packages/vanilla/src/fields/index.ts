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
import BooleanField, { booleanFieldTester } from './BooleanField';
import DateField, { dateFieldTester } from './DateField';
import DateTimeField, { dateTimeFieldTester } from './DateTimeField';
import EnumField, { enumFieldTester } from './EnumField';
import IntegerField, { integerFieldTester } from './IntegerField';
import NumberField, { numberFieldTester } from './NumberField';
import NumberFormatField, {
  numberFormatFieldTester
} from './NumberFormatField';
import SliderField, { sliderFieldTester } from './SliderField';
import TextField, { textFieldTester } from './TextField';
import TextAreaField, { textAreaFieldTester } from './TextAreaField';
import TimeField, { timeFieldTester } from './TimeField';
import * as Customizable from './CustomizableFields';

export {
  BooleanField,
  booleanFieldTester,
  DateField,
  dateFieldTester,
  DateTimeField,
  dateTimeFieldTester,
  EnumField,
  enumFieldTester,
  IntegerField,
  integerFieldTester,
  NumberField,
  numberFieldTester,
  NumberFormatField,
  numberFormatFieldTester,
  SliderField,
  sliderFieldTester,
  TextField,
  textFieldTester,
  TextAreaField,
  textAreaFieldTester,
  TimeField,
  timeFieldTester
};
export { Customizable };
