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
import test from 'ava';
import { registerStyle, registerStyles, unregisterStyle } from '../src/actions';
import { stylingReducer } from '../src/reducers';
import { findStyle, findStyleAsClassName } from '../src/reducers/styling';

test('register single style', (t) => {
  const after = stylingReducer(
    [],
    registerStyle('button', ['btn', 'btn-primary'])
  );
  t.deepEqual(findStyle(after)('button'), ['btn', 'btn-primary']);
});

test('register styles', (t) => {
  const after = stylingReducer(
    [],
    registerStyles([
      {
        name: 'button',
        classNames: ['btn', 'btn-primary'],
      },
      {
        name: 'select',
        classNames: ['custom-select'],
      },
    ])
  );
  t.deepEqual(findStyle(after)('button'), ['btn', 'btn-primary']);
  t.deepEqual(findStyle(after)('select'), ['custom-select']);
});

test('unregister style', (t) => {
  const after = stylingReducer(
    [
      { name: 'button', classNames: ['btn', 'btn-primary'] },
      { name: 'select', classNames: ['custom-select'] },
    ],
    unregisterStyle('button')
  );
  t.is(after.length, 1);
});

test('return classNames as concatenated string', (t) => {
  const after = stylingReducer(
    [],
    registerStyle('button', ['btn', 'btn-primary'])
  );

  t.is(findStyleAsClassName(after)('button'), 'btn btn-primary');
  t.is(findStyleAsClassName(after)('something'), '');
});

test('overwrite any existing style', (t) => {
  const after = stylingReducer(
    [],
    registerStyle('button', ['btn', 'btn-primary'])
  );
  t.is(
    findStyleAsClassName(
      stylingReducer(after, registerStyle('button', ['something-else']))
    )('button'),
    'something-else'
  );
});
