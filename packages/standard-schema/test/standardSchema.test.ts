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
import * as v from 'valibot';
import { toStandardJsonSchema } from '@valibot/to-json-schema';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { coreReducer, errorAt, init, JsonSchema } from '@jsonforms/core';
import {
  deriveJsonSchema,
  fromStandardSchema,
  keyForIssue,
  pathToPointer,
  standardSchemaValidator,
} from '../src';

const person = v.object({
  name: v.pipe(v.string(), v.minLength(2)),
  age: v.optional(v.pipe(v.number(), v.integer(), v.minValue(18))),
  email: v.optional(v.pipe(v.string(), v.email())),
  role: v.optional(v.picklist(['admin', 'user'])),
  kind: v.optional(v.literal('person')),
  address: v.optional(
    v.object({
      street: v.string(),
      'zip/code': v.pipe(v.string(), v.regex(/^\d{5}$/)),
    })
  ),
});

const form = fromStandardSchema(person, {
  jsonSchema: toStandardJsonSchema(person),
});

test('deriveJsonSchema - produces a draft-07 object schema from Valibot', (t) => {
  const schema = form.jsonSchema as JsonSchema & { $schema?: string };
  t.is(schema.type, 'object');
  t.deepEqual(schema.required, ['name']);
  t.deepEqual(schema.properties.name, { type: 'string', minLength: 2 });
  t.deepEqual(schema.properties.role.enum, ['admin', 'user']);
  t.deepEqual(schema.properties.kind, { const: 'person' });
  t.is(schema.properties.address.properties['zip/code'].type, 'string');
  t.true((schema.$schema ?? '').includes('draft-07'));
});

test('deriveJsonSchema - honours target and io', (t) => {
  const schema = deriveJsonSchema(person, {
    jsonSchema: toStandardJsonSchema(person),
    target: 'draft-2020-12',
    io: 'output',
  }) as JsonSchema & { $schema?: string };
  t.true((schema.$schema ?? '').includes('2020-12'));
});

test('deriveJsonSchema - accepts a ready JSON Schema', (t) => {
  const given: JsonSchema = { type: 'object' };
  t.is(deriveJsonSchema(person, { jsonSchema: given }), given);
});

test('deriveJsonSchema - explains what to do when nothing provides a JSON Schema', (t) => {
  const error = t.throws(() => deriveJsonSchema(person));
  t.regex(error.message, /valibot/);
  t.regex(error.message, /toStandardJsonSchema/);
});

test('validator - no issues for valid data', (t) => {
  t.deepEqual(form.validator.validate({ name: 'Ada', age: 36 }), []);
});

test('validator - maps Valibot issues to paths and keywords', (t) => {
  const issues = form.validator.validate({
    name: 'A',
    age: 17.5,
    email: 'nope',
    role: 'guest',
    kind: 'robot',
    address: { 'zip/code': '12' },
  });
  const byPath = Object.fromEntries(
    issues.map((issue) => [`${issue.path} ${issue.key}`, issue])
  );
  t.truthy(byPath['/name minLength']);
  t.truthy(byPath['/age integer'] ?? byPath['/age minimum']);
  t.truthy(byPath['/email format']);
  t.truthy(byPath['/role enum']);
  t.truthy(byPath['/kind const']);
  t.truthy(byPath['/address/street required']);
  t.truthy(byPath['/address/zip~1code pattern']);
  for (const issue of issues) {
    t.is(issue.severity, 'error');
    t.is(typeof issue.message, 'string');
  }
});

test('validator - a missing required property points at the property', (t) => {
  const issues = form.validator.validate({});
  t.deepEqual(
    issues.map((i) => [i.path, i.key]),
    [['/name', 'required']]
  );
});

test('validator - keyFor override wins', (t) => {
  const validator = standardSchemaValidator(person, {
    keyFor: () => 'overridden',
  });
  t.is(validator.validate({})[0].key, 'overridden');
});

test('validator - asynchronous schemas are rejected with guidance', (t) => {
  const asyncSchema: StandardSchemaV1 = {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: async () => ({ value: undefined }),
    },
  };
  const validator = standardSchemaValidator(asyncSchema);
  const error = t.throws(() => validator.validate({}));
  t.regex(error.message, /asynchronously/);
  t.regex(error.message, /middleware/);
});

test('pathToPointer - handles keys, segments and escaping', (t) => {
  t.is(pathToPointer(undefined), '');
  t.is(pathToPointer([]), '');
  t.is(pathToPointer(['a', 0, 'b']), '/a/0/b');
  t.is(pathToPointer([{ key: 'a' }, { key: 1 }]), '/a/1');
  t.is(pathToPointer(['a/b', 'c~d']), '/a~1b/c~0d');
});

test('keyForIssue - Zod issue shapes', (t) => {
  const zod = (issue: object) =>
    keyForIssue({ message: '', ...issue } as StandardSchemaV1.Issue, 'zod');
  t.is(zod({ code: 'invalid_type', received: 'undefined' }), 'required');
  t.is(zod({ code: 'invalid_type', input: undefined }), 'required');
  t.is(zod({ code: 'invalid_type', received: 'string' }), 'type');
  t.is(zod({ code: 'too_small', origin: 'string' }), 'minLength');
  t.is(zod({ code: 'too_big', origin: 'number' }), 'maximum');
  t.is(zod({ code: 'too_small', origin: 'array' }), 'minItems');
  t.is(zod({ code: 'invalid_format', format: 'email' }), 'format');
  t.is(zod({ code: 'invalid_format', format: 'regex' }), 'pattern');
  t.is(zod({ code: 'unrecognized_keys' }), 'additionalProperties');
  t.is(zod({ code: 'invalid_value' }), 'enum');
  t.is(zod({ code: 'something_new' }), 'custom');
});

test('keyForIssue - ArkType and unknown vendors', (t) => {
  const ark = (code: string) =>
    keyForIssue({ message: '', code } as StandardSchemaV1.Issue, 'arktype');
  t.is(ark('missing'), 'required');
  t.is(ark('domain'), 'type');
  t.is(ark('unit'), 'const');
  t.is(ark('pattern'), 'pattern');
  t.is(ark('min'), 'minimum');
  t.is(ark('extraneous'), 'additionalProperties');
  t.is(ark('whatever'), 'custom');
  t.is(keyForIssue({ message: '' }, 'somebody-else'), 'custom');
});

test('end to end - JSON Forms core stores the issues as errors with parentSchema', (t) => {
  const core = coreReducer(
    undefined,
    init(
      { name: 'A', address: { 'zip/code': '12' } },
      form.jsonSchema,
      undefined,
      {
        validator: form.validator,
      }
    )
  );
  const nameErrors = errorAt('name', form.jsonSchema)(core);
  t.is(nameErrors.length, 1);
  t.is(nameErrors[0].keyword, 'minLength');
  t.deepEqual(nameErrors[0].parentSchema, { type: 'string', minLength: 2 });

  const streetErrors = errorAt('address.street', form.jsonSchema)(core);
  t.is(streetErrors.length, 1);
  t.is(streetErrors[0].keyword, 'required');
  t.deepEqual(streetErrors[0].params, { missingProperty: 'street' });

  t.is(core.ajv !== undefined, true);
  t.is(core.validator, undefined);
});
