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
  isSchemaMatch,
  isStructuralMatch,
  structuralKeywords,
} from '../../src/util/structural';
import { createAjv } from '../../src/util/validator';

/**
 * The behaviour the Structural Matcher replaces: compile the branch with AJV,
 * validate, and ignore every error whose keyword is not structural.
 */
const ajvStructuralMatch = (schema: JsonSchema, data: unknown): boolean => {
  const validate = createAjv().compile(schema);
  validate(data);
  const errors: ErrorObject[] = validate.errors ?? [];
  return !errors.some((e) =>
    (structuralKeywords as readonly string[]).includes(e.keyword)
  );
};

const cases: Array<{ name: string; schema: JsonSchema; data: unknown }> = [
  { name: 'type string ok', schema: { type: 'string' }, data: 'a' },
  { name: 'type string fail', schema: { type: 'string' }, data: 1 },
  { name: 'type integer ok', schema: { type: 'integer' }, data: 2 },
  { name: 'type integer fail', schema: { type: 'integer' }, data: 2.5 },
  { name: 'type number ok', schema: { type: 'number' }, data: 2.5 },
  { name: 'type null ok', schema: { type: 'null' }, data: null },
  { name: 'type object fail on array', schema: { type: 'object' }, data: [] },
  { name: 'type array ok', schema: { type: 'array' }, data: [] },
  {
    name: 'type union ok',
    schema: { type: ['string', 'null'] },
    data: null,
  },
  {
    name: 'type union fail',
    schema: { type: ['string', 'null'] },
    data: 1,
  },
  { name: 'enum ok', schema: { enum: ['a', 'b'] }, data: 'b' },
  { name: 'enum fail', schema: { enum: ['a', 'b'] }, data: 'c' },
  {
    name: 'enum deep equal ok',
    schema: { enum: [{ x: 1 }] },
    data: { x: 1 },
  },
  { name: 'const ok', schema: { const: 5 }, data: 5 },
  { name: 'const fail', schema: { const: 5 }, data: 6 },
  { name: 'const null ok', schema: { const: null }, data: null },
  {
    name: 'required ok',
    schema: { type: 'object', required: ['a'] },
    data: { a: 1 },
  },
  {
    name: 'required fail',
    schema: { type: 'object', required: ['a'] },
    data: { b: 1 },
  },
  {
    name: 'required ignored on non-object',
    schema: { required: ['a'] },
    data: 'str',
  },
  {
    name: 'nested properties type fail',
    schema: {
      type: 'object',
      properties: {
        a: { type: 'object', properties: { b: { type: 'string' } } },
      },
    },
    data: { a: { b: 1 } },
  },
  {
    name: 'nested properties ok',
    schema: {
      type: 'object',
      properties: {
        a: { type: 'object', properties: { b: { type: 'string' } } },
      },
    },
    data: { a: { b: 'x' } },
  },
  {
    name: 'additionalProperties false fail',
    schema: {
      type: 'object',
      properties: { a: { type: 'string' } },
      additionalProperties: false,
    },
    data: { a: 'x', b: 1 },
  },
  {
    name: 'additionalProperties false ok',
    schema: {
      type: 'object',
      properties: { a: { type: 'string' } },
      additionalProperties: false,
    },
    data: { a: 'x' },
  },
  {
    name: 'additionalProperties schema fail',
    schema: {
      type: 'object',
      properties: { a: { type: 'string' } },
      additionalProperties: { type: 'number' },
    },
    data: { a: 'x', b: 'not a number' },
  },
  {
    name: 'additionalProperties with patternProperties ok',
    schema: {
      type: 'object',
      patternProperties: { '^x-': { type: 'string' } },
      additionalProperties: false,
    },
    data: { 'x-a': 'ok' },
  },
  {
    name: 'patternProperties type fail',
    schema: {
      type: 'object',
      patternProperties: { '^x-': { type: 'string' } },
    },
    data: { 'x-a': 1 },
  },
  {
    name: 'items type fail',
    schema: { type: 'array', items: { type: 'string' } },
    data: ['a', 1],
  },
  {
    name: 'items type ok',
    schema: { type: 'array', items: { type: 'string' } },
    data: ['a', 'b'],
  },
  {
    name: 'tuple items fail',
    schema: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
    data: ['a', 'b'],
  },
  {
    name: 'nested anyOf ok',
    schema: {
      type: 'object',
      properties: { v: { anyOf: [{ type: 'string' }, { type: 'number' }] } },
    },
    data: { v: 1 },
  },
  {
    name: 'nested anyOf fail',
    schema: {
      type: 'object',
      properties: { v: { anyOf: [{ type: 'string' }, { type: 'number' }] } },
    },
    data: { v: true },
  },
  {
    name: 'nested allOf fail',
    schema: { allOf: [{ type: 'object' }, { required: ['a'] }] },
    data: { b: 1 },
  },
  {
    name: 'nested oneOf none fail',
    schema: { oneOf: [{ const: 'a' }, { const: 'b' }] },
    data: 'c',
  },
  {
    name: 'nested oneOf several match is structurally fine',
    schema: { oneOf: [{ type: 'string' }, { const: 'a' }] },
    data: 'a',
  },
  {
    name: 'not is ignored like AJV filtering does',
    schema: { not: { type: 'string' } },
    data: 'a',
  },
  {
    name: 'non-structural keywords are ignored (pattern, minLength, format)',
    schema: {
      type: 'string',
      pattern: '^a',
      minLength: 10,
      format: 'email',
    },
    data: 'b',
  },
  {
    name: 'if then else uses then branch',
    schema: {
      type: 'object',
      if: { properties: { kind: { const: 'a' } } },
      then: { required: ['aValue'] },
      else: { required: ['bValue'] },
    },
    data: { kind: 'a', bValue: 1 },
  },
  {
    name: 'if then else uses else branch',
    schema: {
      type: 'object',
      if: { properties: { kind: { const: 'a' } } },
      then: { required: ['aValue'] },
      else: { required: ['bValue'] },
    },
    data: { kind: 'b', bValue: 1 },
  },
  {
    name: '$ref resolved against root',
    schema: {
      type: 'object',
      properties: { pet: { $ref: '#/definitions/cat' } },
      definitions: {
        cat: { type: 'object', required: ['meow'] },
      },
    },
    data: { pet: { bark: true } },
  },
  {
    name: 'nullable with type allows null',
    schema: { type: 'string', nullable: true } as JsonSchema,
    data: null,
  },
];

for (const c of cases) {
  test(`isStructuralMatch agrees with filtered AJV: ${c.name}`, (t) => {
    t.is(
      isStructuralMatch(c.schema, c.data),
      ajvStructuralMatch(c.schema, c.data)
    );
  });
}

test('isStructuralMatch - boolean schemas', (t) => {
  t.true(isStructuralMatch(true, 'anything'));
  t.false(isStructuralMatch(false, 'anything'));
  t.true(isStructuralMatch(undefined, 'anything'));
});

test('isStructuralMatch - unresolvable $ref does not match', (t) => {
  const root: JsonSchema = { definitions: {} };
  t.false(isStructuralMatch({ $ref: '#/definitions/missing' }, {}, root));
});

test('isStructuralMatch - $ref branch resolved via explicit root schema', (t) => {
  const root: JsonSchema = {
    definitions: {
      dog: {
        type: 'object',
        properties: { kind: { const: 'dog' } },
        required: ['kind'],
      },
    },
  };
  t.true(
    isStructuralMatch({ $ref: '#/definitions/dog' }, { kind: 'dog' }, root)
  );
  t.false(
    isStructuralMatch({ $ref: '#/definitions/dog' }, { kind: 'cat' }, root)
  );
});

test('isStructuralMatch - recursive schema terminates', (t) => {
  const root: JsonSchema = {
    definitions: {
      node: {
        type: 'object',
        properties: {
          children: { type: 'array', items: { $ref: '#/definitions/node' } },
        },
      },
    },
  };
  const data: unknown = { children: [{ children: [{ children: [] }] }] };
  t.true(isStructuralMatch({ $ref: '#/definitions/node' }, data, root));
  t.false(
    isStructuralMatch(
      { $ref: '#/definitions/node' },
      { children: [{ children: 'not an array' }] },
      root
    )
  );
});

test('isStructuralMatch - invalid patternProperties regex is ignored', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    patternProperties: { '(': { type: 'string' } },
  };
  t.true(isStructuralMatch(schema, { a: 1 }));
});

test('isStructuralMatch - undefined property values do not count as present', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    required: ['a'],
    properties: { a: { type: 'string' } },
    additionalProperties: false,
  };
  t.false(isStructuralMatch(schema, { a: undefined }));
  t.true(isStructuralMatch(schema, { a: 'x', b: undefined }));
});

/** Full AJV validity, the reference for isSchemaMatch. */
const ajvValid = (schema: JsonSchema, data: unknown): boolean =>
  createAjv().validate(schema, data) as boolean;

const valueCases: Array<{ name: string; schema: JsonSchema; data: unknown }> = [
  { name: 'minimum ok', schema: { minimum: 3 }, data: 3 },
  { name: 'minimum fail', schema: { minimum: 3 }, data: 2.5 },
  { name: 'maximum ok', schema: { maximum: 3 }, data: 3 },
  { name: 'maximum fail', schema: { maximum: 3 }, data: 4 },
  { name: 'exclusiveMinimum ok', schema: { exclusiveMinimum: 3 }, data: 3.1 },
  { name: 'exclusiveMinimum fail', schema: { exclusiveMinimum: 3 }, data: 3 },
  { name: 'exclusiveMaximum ok', schema: { exclusiveMaximum: 3 }, data: 2 },
  { name: 'exclusiveMaximum fail', schema: { exclusiveMaximum: 3 }, data: 3 },
  { name: 'multipleOf ok', schema: { multipleOf: 0.5 }, data: 2.5 },
  { name: 'multipleOf fail', schema: { multipleOf: 2 }, data: 3 },
  {
    name: 'numeric keywords ignore strings',
    schema: { minimum: 3 },
    data: 'a',
  },
  { name: 'minLength ok', schema: { minLength: 2 }, data: 'ab' },
  { name: 'minLength fail', schema: { minLength: 2 }, data: 'a' },
  {
    name: 'minLength counts code points',
    schema: { minLength: 2 },
    data: '😀',
  },
  { name: 'maxLength ok', schema: { maxLength: 2 }, data: 'ab' },
  { name: 'maxLength fail', schema: { maxLength: 2 }, data: 'abc' },
  { name: 'pattern ok', schema: { pattern: '^a.c$' }, data: 'abc' },
  { name: 'pattern fail', schema: { pattern: '^a.c$' }, data: 'abd' },
  { name: 'pattern is unanchored', schema: { pattern: 'b' }, data: 'abc' },
  { name: 'minItems fail', schema: { minItems: 2 }, data: [1] },
  { name: 'maxItems fail', schema: { maxItems: 1 }, data: [1, 2] },
  {
    name: 'uniqueItems ok',
    schema: { uniqueItems: true },
    data: [1, 2, { a: 1 }],
  },
  {
    name: 'uniqueItems fail',
    schema: { uniqueItems: true },
    data: [{ a: 1 }, { a: 1 }],
  },
  { name: 'minProperties fail', schema: { minProperties: 2 }, data: { a: 1 } },
  {
    name: 'maxProperties fail',
    schema: { maxProperties: 1 },
    data: { a: 1, b: 2 },
  },
  { name: 'not ok', schema: { not: { type: 'string' } }, data: 1 },
  { name: 'not fail', schema: { not: { type: 'string' } }, data: 'a' },
  { name: 'not with const fail', schema: { not: { const: 'x' } }, data: 'x' },
  {
    name: 'nested value constraint in properties',
    schema: {
      type: 'object',
      properties: { age: { type: 'integer', minimum: 18 } },
    },
    data: { age: 17 },
  },
  {
    name: 'value constraint inside anyOf',
    schema: {
      anyOf: [
        { type: 'string', minLength: 5 },
        { type: 'number', minimum: 10 },
      ],
    },
    data: 12,
  },
  {
    name: 'value constraint inside anyOf fail',
    schema: {
      anyOf: [
        { type: 'string', minLength: 5 },
        { type: 'number', minimum: 10 },
      ],
    },
    data: 3,
  },
  {
    name: 'rule-like condition: range',
    schema: { type: 'number', minimum: 1, maximum: 10 },
    data: 5,
  },
];

for (const c of valueCases) {
  test(`isSchemaMatch agrees with AJV: ${c.name}`, (t) => {
    t.is(isSchemaMatch(c.schema, c.data), ajvValid(c.schema, c.data));
  });
}

test('isSchemaMatch - draft-04 boolean exclusiveMinimum/exclusiveMaximum', (t) => {
  const min = { minimum: 3, exclusiveMinimum: true } as unknown as JsonSchema;
  t.false(isSchemaMatch(min, 3));
  t.true(isSchemaMatch(min, 3.1));
  const max = { maximum: 3, exclusiveMaximum: true } as unknown as JsonSchema;
  t.false(isSchemaMatch(max, 3));
  t.true(isSchemaMatch(max, 2.9));
});

test('isSchemaMatch - invalid pattern is ignored, format is not evaluated', (t) => {
  t.true(isSchemaMatch({ pattern: '(' }, 'anything'));
  t.true(isSchemaMatch({ type: 'string', format: 'email' }, 'not an email'));
});

test('isStructuralMatch - still ignores value constraints', (t) => {
  t.true(isStructuralMatch({ minimum: 3 }, 1));
  t.true(isStructuralMatch({ pattern: '^a' }, 'b'));
  t.true(isStructuralMatch({ not: { type: 'string' } }, 'a'));
  t.true(isStructuralMatch({ minLength: 10 }, 'short'));
});

test('isSchemaMatch - also enforces every structural keyword', (t) => {
  t.false(isSchemaMatch({ type: 'string' }, 1));
  t.false(isSchemaMatch({ required: ['a'] }, {}));
  t.true(isSchemaMatch({ enum: ['a'] }, 'a'));
});
