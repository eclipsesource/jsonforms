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
import { findRefs } from '../../src/util/resolvers';
import test from 'ava';

test('findRef - does not fail on empty input object ', t => {
  const refObject = {};
  t.true(Object.keys(findRefs(refObject)).length === 0);
});

test('findRef - finds http ref on level 1', t => {
  const refObject = {
    type: 'object',
    properties: {
      myitem: {
        $ref: 'http://myref.com/ref'
      }
    }
  };
  t.true(Object.keys(findRefs(refObject)).length > 0);
});

test('findRef - finds http ref on root level ', t => {
  const refObject = {
    $ref: 'http://myref.com/ref'
  };
  t.true(Object.keys(findRefs(refObject)).length > 0);
});

test('findRef - finds any ref on root level ', t => {
  const refObject = {
    $ref: 'xxx'
  };
  t.true(Object.keys(findRefs(refObject)).length > 0);
});

test('findRef - no ref in no ref object ', t => {
  const refObject = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        description: 'Please enter your name'
      },
      vegetarian: {
        type: 'boolean'
      },
      birthDate: {
        type: 'string',
        format: 'date',
        description: 'Please enter your birth date.'
      },
      nationality: {
        type: 'string',
        enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
      }
    }
  };
  t.true(Object.keys(findRefs(refObject)).length === 0);
});
