/*
  The MIT License
  
  Copyright (c) 2021 EclipseSource Munich
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
import { registerExamples } from '../register';
import { UISchemaElement } from '@jsonforms/core';

export const schema = {
  type: 'object',
  properties: {
    propText0: {type: 'string'},
    propText1: {type: 'string'},
    propText2: {type: 'string'},
    propText3: {type: 'string'},
    propText4: {type: 'string'},
    propText5: {type: 'string'},
    propText6: {type: 'string'},
    propText7: {type: 'string'},
    propText8: {type: 'string'},
    propText9: {type: 'string'},
    propNumber0: {type: 'number'},
    propNumber1: {type: 'number'},
    propNumber2: {type: 'number'},
    propNumber3: {type: 'number'},
    propNumber4: {type: 'number'},
    propNumber5: {type: 'number'},
    propNumber6: {type: 'number'},
    propNumber7: {type: 'number'},
    propNumber8: {type: 'number'},
    propNumber9: {type: 'number'},
  }
};

export const uischema: UISchemaElement = undefined;

export const data = {};

registerExamples([
  {
    name: '1645',
    label: 'Issue 1645',
    data,
    schema,
    uischema
  }
]);
