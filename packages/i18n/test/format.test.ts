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
import test from 'ava';
import { fromNumber } from '../src';

test.beforeEach(t => {
  t.context.data =  { 'money': '123456' };
  t.context.schema = {
    type: 'object',
    properties: {
      money: { type: 'string'}
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/money',
    options: {
      format: true
    }
  };
  t.context.styles = [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ];
  t.context.locale = 'en-US';
  t.context.numberSeparators = {
    'en-US': {
      decimalSeparator: '.',
      thousandsSeparator: ','
    }
  };
});

test('render', t => {
  const formatted = fromNumber('en-US')(123456);
  t.is(formatted, '123,456');
});
