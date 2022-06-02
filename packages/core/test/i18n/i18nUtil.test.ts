/*
  The MIT License
  
  Copyright (c) 2017-2021 EclipseSource Munich
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

import { ControlElement, getI18nKeyPrefixBySchema, i18nJsonSchema, transformPathToI18nPrefix } from '../../src';

test('transformPathToI18nPrefix returns root when empty', t => {
  t.is(transformPathToI18nPrefix(''), 'root');
});

test('transformPathToI18nPrefix does not modify non-array paths', t => {
  t.is(transformPathToI18nPrefix('foo'), 'foo');
  t.is(transformPathToI18nPrefix('foo.bar'), 'foo.bar');
  t.is(transformPathToI18nPrefix('bar3.foo2'), 'bar3.foo2');
});

test('transformPathToI18nPrefix removes array indices', t => {
  t.is(transformPathToI18nPrefix('foo.2.bar'), 'foo.bar');
  t.is(transformPathToI18nPrefix('foo.234324234.bar'), 'foo.bar');
  t.is(transformPathToI18nPrefix('foo.0.bar'), 'foo.bar');
  t.is(transformPathToI18nPrefix('foo.0.bar.1.foobar'), 'foo.bar.foobar');
  t.is(transformPathToI18nPrefix('3.foobar'), 'foobar');
  t.is(transformPathToI18nPrefix('foobar.3'), 'foobar');
  t.is(transformPathToI18nPrefix('foo1.23.b2ar3.1.5.foo'), 'foo1.b2ar3.foo');
  t.is(transformPathToI18nPrefix('3'), 'root');
});

test('getI18nKeyPrefixBySchema gets key from uischema over schema', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    i18n: 'controlFoo'
  };
  const schema: i18nJsonSchema = {
    type: 'string',
    i18n: 'schemaFoo'
  }
  t.is(getI18nKeyPrefixBySchema(schema, control), 'controlFoo');
});

test('getI18nKeyPrefixBySchema gets schema key for missing uischema key', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };
  const schema: i18nJsonSchema = {
    type: 'string',
    i18n: 'schemaFoo'
  }
  t.is(getI18nKeyPrefixBySchema(schema, control), 'schemaFoo');
});

test('getI18nKeyPrefixBySchema returns undefined for missing uischema and schema keys', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };
  const schema: i18nJsonSchema = {
    type: 'string',
  }
  t.is(getI18nKeyPrefixBySchema(schema, control), undefined);
});

test('getI18nKeyPrefixBySchema returns undefined for undefined parameters', t => {
  t.is(getI18nKeyPrefixBySchema(undefined, undefined), undefined);
});