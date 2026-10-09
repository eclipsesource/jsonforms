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
  ajvErrorsToIssues,
  compiledAjvValidator,
  createAjvValidator,
  isFormValidator,
  isFormValidatorFactory,
  issuesToErrors,
  resolveParentSchema,
  toFormValidatorFactory,
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
    pet: { $ref: '#/definitions/pet' },
    extra: { type: 'object', additionalProperties: { type: 'number' } },
  },
  required: ['name'],
  definitions: {
    pet: { type: 'object', properties: { kind: { type: 'string' } } },
  },
};

test('ajvErrorsToIssues - maps AJV fields and keeps the rest', (t) => {
  const validateFn = createAjv().compile(schema);
  validateFn({ name: 'ab', tags: [1] });
  const issues = ajvErrorsToIssues(validateFn.errors);
  t.is(issues.length, 2);
  const [minLength, type] = issues;
  t.is(minLength.path, '/name');
  t.is(minLength.key, 'minLength');
  t.is(minLength.severity, 'error');
  t.deepEqual(minLength.params, { limit: 3 });
  t.deepEqual(minLength.parentSchema, schema.properties.name);
  t.is(minLength.schemaPath, '#/properties/name/minLength');
  t.is(type.path, '/tags/0');
  t.is(type.key, 'type');
  t.is(ajvErrorsToIssues(null).length, 0);
});

test('issuesToErrors - round trip of AJV errors is lossless', (t) => {
  const validateFn = createAjv().compile(schema);
  validateFn({ tags: ['ok', 2], address: {} });
  const original = validateFn.errors;
  const roundTripped = issuesToErrors(ajvErrorsToIssues(original), schema);
  t.deepEqual(roundTripped, original);
});

test('issuesToErrors - missing key becomes custom', (t) => {
  const [error] = issuesToErrors([{ path: '/name', message: 'nope' }], schema);
  t.is(error.keyword, 'custom');
  t.is(error.instancePath, '/name');
  t.is(error.message, 'nope');
  t.deepEqual(error.params, {});
  t.is(error.schemaPath, '');
  t.deepEqual(error.parentSchema, schema.properties.name);
});

test('issuesToErrors - required issue addressed to the missing property is split', (t) => {
  const [error] = issuesToErrors(
    [{ path: '/address/street', key: 'required', message: 'is required' }],
    schema
  );
  t.is(error.instancePath, '/address');
  t.deepEqual(error.params, { missingProperty: 'street' });
  t.deepEqual(error.parentSchema, schema.properties.address);
});

test('issuesToErrors - required split decodes JSON Pointer escapes', (t) => {
  const [error] = issuesToErrors([
    { path: '/a~1b', key: 'required', message: 'is required' },
  ]);
  t.is(error.instancePath, '');
  t.deepEqual(error.params, { missingProperty: 'a/b' });
});

test('issuesToErrors - required issue with params is left alone', (t) => {
  const issue: ValidationIssue = {
    path: '',
    key: 'required',
    message: 'is required',
    params: { missingProperty: 'name' },
  };
  const [error] = issuesToErrors([issue], schema);
  t.is(error.instancePath, '');
  t.deepEqual(error.params, { missingProperty: 'name' });
  t.deepEqual(error.parentSchema, schema);
});

test('issuesToErrors - non-error severities are dropped', (t) => {
  const issues = [
    { path: '/name', key: 'x', message: 'warn', severity: 'warning' },
    { path: '/name', key: 'y', message: 'err', severity: 'error' },
    { path: '/name', key: 'z', message: 'none' },
  ] as unknown as ValidationIssue[];
  const errors = issuesToErrors(issues, schema);
  t.deepEqual(
    errors.map((e) => e.keyword),
    ['y', 'z']
  );
});

test('issuesToErrors - explicit parentSchema wins over resolution', (t) => {
  const parentSchema: JsonSchema = { type: 'string' };
  const [error] = issuesToErrors(
    [{ path: '/name', key: 'type', message: 'm', parentSchema }],
    schema
  );
  t.is(error.parentSchema, parentSchema);
});

test('issuesToErrors - tolerates null and undefined', (t) => {
  t.deepEqual(issuesToErrors(null), []);
  t.deepEqual(issuesToErrors(undefined), []);
});

test('resolveParentSchema - walks properties, items, additionalProperties and $ref', (t) => {
  t.deepEqual(resolveParentSchema(schema, ''), schema);
  t.deepEqual(resolveParentSchema(schema, '/name'), schema.properties.name);
  t.deepEqual(resolveParentSchema(schema, '/tags/3'), { type: 'string' });
  t.deepEqual(
    resolveParentSchema(schema, '/address/street'),
    schema.properties.address.properties.street
  );
  t.deepEqual(resolveParentSchema(schema, '/pet'), schema.definitions.pet);
  t.deepEqual(resolveParentSchema(schema, '/pet/kind'), { type: 'string' });
  t.deepEqual(resolveParentSchema(schema, '/extra/anything'), {
    type: 'number',
  });
  t.is(resolveParentSchema(schema, '/unknown/deeper'), undefined);
  t.is(resolveParentSchema(undefined, '/name'), undefined);
});

test('compiledAjvValidator - wraps a compiled validate function', (t) => {
  const validateFn = createAjv().compile(schema);
  const validator = compiledAjvValidator(validateFn);
  t.is(validator.validateFn, validateFn);
  t.deepEqual(validator.validate({ name: 'Ada' }), []);
  const issues = validator.validate({});
  t.is(issues.length, 1);
  t.is(issues[0].key, 'required');
  t.deepEqual(issues[0].params, { missingProperty: 'name' });
  t.is(validator.matches, undefined);
});

test('createAjvValidator - compiles with the given instance and offers matches', (t) => {
  const ajv = createAjv();
  let compiled = 0;
  const originalCompile = ajv.compile.bind(ajv);
  ajv.compile = ((s: JsonSchema) => {
    compiled++;
    return originalCompile(s);
  }) as typeof ajv.compile;
  const factory = createAjvValidator(ajv);
  const validator = factory(schema);
  t.is(compiled, 1);
  t.is(validator.validate({ name: 'Ada' }).length, 0);
  t.true(validator.matches({ const: 'a' }, 'a'));
  t.false(validator.matches({ const: 'a' }, 'b'));
});

test('createAjvValidator - falls back to a default instance', (t) => {
  const validator = createAjvValidator()(schema);
  t.is(validator.validate({ name: 'Ada' }).length, 0);
  t.is(validator.validate({ name: 'A' }).length, 1);
});

test('toFormValidatorFactory and guards', (t) => {
  const bound = { validate: () => [] as ValidationIssue[] };
  const factory = () => bound;
  t.true(isFormValidator(bound));
  t.false(isFormValidator(factory));
  t.false(isFormValidator(null));
  t.true(isFormValidatorFactory(factory));
  t.false(isFormValidatorFactory(bound));
  t.is(toFormValidatorFactory(factory), factory);
  t.is(toFormValidatorFactory(bound)(schema), bound);
});

test('issuesToErrors - result satisfies the ErrorObject contract', (t) => {
  const errors: ErrorObject[] = issuesToErrors([
    { path: '/name', key: 'minLength', message: 'short', params: { limit: 3 } },
  ]);
  t.is(errors[0].keyword, 'minLength');
  t.is(errors[0].instancePath, '/name');
  t.is(typeof errors[0].schemaPath, 'string');
});
