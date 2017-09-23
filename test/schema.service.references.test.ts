/* tslint:disable:max-file-line-count */
import { test } from 'ava';
import { collectReferencePaths } from '../src/core/schema.service.impl';
import { JsonSchema } from '../src/models/jsonSchema';
import { JsonForms } from '../src/core';
import { jsonSchemaFourMod } from './data/schema-04';

test.beforeEach(t => {
  t.context.simpleSchema = {
    type: 'object',
    properties: {
      a: { type: 'string' }
    },
    required: ['a']
  };
  t.context.data = {
    a: 'A',
    obj: {
      arr: [
        { i: 10 },
        { a: 'B'}
      ],
      ted: {
        a: 'C'
      },
      uhu: {
        a: 2
      }
    }
  };
});

test('Simple Schema - Root Scope', t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectReferencePaths(data, '#', schema);

  t.true(Array.isArray(paths));
  t.is(paths.length, 3);
  t.true(paths.indexOf('#') > -1);
  t.true(paths.indexOf('#/obj/arr/1') > -1);
  t.true(paths.indexOf('#/obj/ted') > -1);
});

test('Simple Schema - Scoped', t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectReferencePaths(data, '#/obj', schema);

  t.true(Array.isArray(paths));
  t.is(paths.length, 2);
  t.true(paths.indexOf('#/obj/arr/1') > -1);
  t.true(paths.indexOf('#/obj/ted') > -1);
});

test('Simple Schema - Root Scope, undefined data', t => {
  const schema = t.context.simpleSchema;
  const paths = collectReferencePaths(undefined, '#', schema);

  t.true(Array.isArray(paths));
  t.is(paths.length, 0);
});

test('Simple Schema - Unresolvable Scope Path', t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectReferencePaths(undefined, '#/invalid/obj', schema);

  t.true(Array.isArray(paths));
  t.is(paths.length, 0);
});

test('Json Schema 04', t => {
  const data = {
    type: 'object',
    properties: {
      str: { type: 'string' },
      obj: {
        type: 'object',
        properties: {
          cascStr: { type: 'string' },
          cascNum: { type: 'number' }
        }
      }
    },
    required: ['str']
  };
  const paths = collectReferencePaths(data, '#', jsonSchemaFourMod);
  t.is(paths.length, 5);
  t.true(paths.indexOf('#') > -1);
  t.true(paths.indexOf('#/properties/str') > -1);
  t.true(paths.indexOf('#/properties/obj') > -1);
  t.true(paths.indexOf('#/properties/obj/properties/cascStr') > -1);
  t.true(paths.indexOf('#/properties/obj/properties/cascNum') > -1);
});

test('Json Schema 04 - $ref not allowed', t => {
  const data = {
    type: 'object',
    properties: {
      str: { type: 'string' },
      obj: {
        type: 'object',
        properties: {
          cascStr: { type: 'string' },
          cascNum: { type: 'number' }
        }
      },
      ref: {
        $ref: '#'
      }
    },
    required: ['str']
  };

  const paths = collectReferencePaths(data, '#', jsonSchemaFourMod);
  t.is(paths.length, 4);
  // path '#' indirectly contains a $ref and is therefore not valid
  t.true(paths.indexOf('#/properties/str') > -1);
  t.true(paths.indexOf('#/properties/obj') > -1);
  t.true(paths.indexOf('#/properties/obj/properties/cascStr') > -1);
  t.true(paths.indexOf('#/properties/obj/properties/cascNum') > -1);
});
