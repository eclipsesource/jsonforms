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
import type { ErrorObject } from 'ajv';
import { JsonSchema } from '../../src/models';
import {
  compiledAjvValidator,
  createAjvValidator,
  issuesToErrors,
  ValidationIssue,
} from '../../src/util/formValidator';
import { createAjv } from '../../src/util/validator';

const schema: JsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
    tags: { type: 'array', items: { type: 'string' } },
    address: {
      type: 'object',
      properties: { street: { type: 'string' } },
      required: ['street'],
    },
  },
  required: ['name'],
};

test('compiledAjvValidator - maps Ajv errors to issues', (t) => {
  const validator = compiledAjvValidator(createAjv().compile(schema));
  t.deepEqual(validator.validate({ name: 'Ada' }), []);
  const issues = validator.validate({ name: 'ab', tags: [1] });
  t.is(issues.length, 2);
  const [minLength, type] = issues;
  t.is(minLength.path, '/name');
  t.is(minLength.key, 'minLength');
  t.deepEqual(minLength.params, { limit: 3 });
  t.deepEqual(minLength.parentSchema, schema.properties.name);
  t.is(type.path, '/tags/0');
  t.is(type.key, 'type');
});

test('issuesToErrors - round trip of Ajv errors is lossless', (t) => {
  const validateFn = createAjv().compile(schema);
  const issues = compiledAjvValidator(validateFn).validate({
    tags: ['ok', 2],
    address: {},
  });
  t.deepEqual(issuesToErrors(issues), validateFn.errors);
});

test('issuesToErrors - missing key becomes custom', (t) => {
  const [error] = issuesToErrors([{ path: '/name', message: 'nope' }]);
  t.is(error.keyword, 'custom');
  t.is(error.instancePath, '/name');
  t.is(error.message, 'nope');
  t.deepEqual(error.params, {});
  t.is(error.schemaPath, '');
  t.is(error.parentSchema, undefined);
});

test('issuesToErrors - required issue addressed to the missing property is split', (t) => {
  const [error] = issuesToErrors([
    { path: '/address/street', key: 'required', message: 'is required' },
  ]);
  t.is(error.instancePath, '/address');
  t.deepEqual(error.params, { missingProperty: 'street' });
});

test('issuesToErrors - required split decodes JSON Pointer escapes', (t) => {
  const [error] = issuesToErrors([
    { path: '/a~1b', key: 'required', message: 'is required' },
  ]);
  t.is(error.instancePath, '');
  t.deepEqual(error.params, { missingProperty: 'a/b' });
});

test('issuesToErrors - required issue without a leading slash is left alone', (t) => {
  const [error] = issuesToErrors([
    { path: 'name', key: 'required', message: 'is required' },
  ]);
  t.is(error.instancePath, 'name');
  t.deepEqual(error.params, {});
});

test('issuesToErrors - required issue with params is left alone', (t) => {
  const issue: ValidationIssue = {
    path: '',
    key: 'required',
    message: 'is required',
    params: { missingProperty: 'name' },
  };
  const [error] = issuesToErrors([issue]);
  t.is(error.instancePath, '');
  t.deepEqual(error.params, { missingProperty: 'name' });
});

test('issuesToErrors - keeps a given parentSchema', (t) => {
  const parentSchema: JsonSchema = { type: 'string' };
  const [error] = issuesToErrors([
    { path: '/name', key: 'type', message: 'm', parentSchema },
  ]);
  t.is(error.parentSchema, parentSchema);
});

test('createAjvValidator - compiles with the given instance', (t) => {
  const ajv = createAjv();
  let compiled = 0;
  const originalCompile = ajv.compile.bind(ajv);
  ajv.compile = ((s: JsonSchema) => {
    compiled++;
    return originalCompile(s);
  }) as typeof ajv.compile;
  const validator = createAjvValidator(ajv)(schema);
  t.is(compiled, 1);
  t.is(validator.validate({ name: 'Ada' }).length, 0);
});

test('createAjvValidator - falls back to a default instance', (t) => {
  const validator = createAjvValidator()(schema);
  t.is(validator.validate({ name: 'Ada' }).length, 0);
  t.is(validator.validate({ name: 'A' }).length, 1);
});

test('issuesToErrors - result satisfies the ErrorObject contract', (t) => {
  const errors: ErrorObject[] = issuesToErrors([
    { path: '/name', key: 'minLength', message: 'short', params: { limit: 3 } },
  ]);
  t.is(errors[0].keyword, 'minLength');
  t.is(errors[0].instancePath, '/name');
  t.is(typeof errors[0].schemaPath, 'string');
});
