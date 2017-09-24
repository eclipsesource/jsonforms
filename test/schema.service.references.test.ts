/* tslint:disable:max-file-line-count */
/* tslint:disable:no-string-literal */
import { test } from 'ava';
import { collectionHelperMap, SchemaServiceImpl } from '../src/core/schema.service.impl';
import { JsonForms } from '../src/core';
import { jsonSchemaFourMod } from './data/schema-04';
import { SchemaService } from '../src/core/schema.service';

test.beforeEach(t => {
  t.context.simpleSchema = {
    type: 'object',
    properties: {
      a: { type: 'string' }
    },
    required: ['a']
  };

  t.context.schema = {
    type: 'object',
    properties: {
      ref: { type: 'string' }
    },
    links: [
      {
        href: '{ref}',
        targetSchema: t.context.simpleSchema
      }
    ]
  };

  t.context.schemaArray = {
    type: 'object',
    properties: {
      ref: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    links: [
      {
        href: '{ref}',
        targetSchema: t.context.simpleSchema
      }
    ]
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

test('Reference Property - path based - find Ref targets', t => {
    const data = t.context.data;
    const schema = t.context.schema;
    JsonForms.rootData = data;

    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    const targets = property.findReferenceTargets();
    console.log('ref prop path based 01 targets', targets);
    const keys = Object.keys(targets);
    t.is(keys.length, 3);
    t.true(keys.indexOf('#') > -1);
    t.true(keys.indexOf('#/obj/arr/1') > -1);
    t.true(keys.indexOf('#/obj/ted') > -1);
    t.is(targets['#'], data);
    t.is(targets['#/obj/arr/1'], data.obj.arr[1]);
    t.is(targets['#/obj/ted'], data.obj.ted);
});

test('Reference Property - path based - find Ref targets in Resource', t => {
    const data = t.context.data;
    const schema = {
      type: 'object',
      properties: {
        ref: { type: 'string' }
      },
      links: [
        {
          href: 'rs://res-name/{ref}',
          targetSchema: t.context.simpleSchema
        }
      ]
    };
    JsonForms.resources.registerResource('res-name', data, false);

    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    const targets = property.findReferenceTargets();
    const keys = Object.keys(targets);
    t.is(keys.length, 3);
    t.true(keys.indexOf('#') > -1);
    t.true(keys.indexOf('#/obj/arr/1') > -1);
    t.true(keys.indexOf('#/obj/ted') > -1);
    t.is(targets['#'], data);
    t.is(targets['#/obj/arr/1'], data.obj.arr[1]);
    t.is(targets['#/obj/ted'], data.obj.ted);
});

test('Reference Property - path based - find Ref targets in scoped Resource', t => {
    const data = t.context.data;
    const schema = {
      type: 'object',
      properties: {
        ref: { type: 'string' }
      },
      links: [
        {
          href: 'rs://res-name/#/obj/{ref}',
          targetSchema: t.context.simpleSchema
        }
      ]
    };
    JsonForms.resources.registerResource('res-name', data, false);

    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    const targets = property.findReferenceTargets();
    const keys = Object.keys(targets);
    t.is(keys.length, 2);
    t.true(keys.indexOf('arr/1') > -1);
    t.true(keys.indexOf('ted') > -1);
    t.is(targets['arr/1'], data.obj.arr[1]);
    t.is(targets['ted'], data.obj.ted);
});

test('Reference Object - path based - resolve Ref target', t => {
    const data = t.context.data;
    const schema = t.context.schema;
    JsonForms.rootData = data;

    const refData = { ref: '#/obj/ted' };
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    const resolved = property.getData(refData);
    console.log('ref prop path based resolved', resolved);
    const keys = Object.keys(resolved);
    t.is(keys.length, 1);
    t.true(keys.indexOf('#/obj/ted') > -1);
    t.is(resolved['#/obj/ted'], data.obj.ted);
});

test('Reference Array - path based - resolve Ref targets', t => {
    const data = t.context.data;
    const schema = t.context.schemaArray;
    JsonForms.rootData = data;

    const refData = { ref: ['#', '#/obj/arr/1', '#/obj/ted'] };
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    const resolved = property.getData(refData);
    const keys = Object.keys(resolved);
    t.is(keys.length, 3);
    t.true(keys.indexOf('#') > -1);
    t.true(keys.indexOf('#/obj/arr/1') > -1);
    t.true(keys.indexOf('#/obj/ted') > -1);
    t.is(resolved['#'], data);
    t.is(resolved['#/obj/ted'], data.obj.ted);
    t.is(resolved['#/obj/arr/1'], data.obj.arr[1]);
});

test('Reference Object - path based - add to defined', t => {
    const data = t.context.data;
    const schema = t.context.schema;
    JsonForms.rootData = data;

    const refData = { ref: '#/obj/ted' };
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    property.addToData(refData, '#');
    t.deepEqual(refData, { ref: '#'});
});

test('Reference Object - path based - add to undefined', t => {
    const data = t.context.data;
    const schema = t.context.schema;
    JsonForms.rootData = data;

    const refData = {};
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    property.addToData(refData, '#');
    t.deepEqual(refData, { ref: '#'});
});

test('Reference Object - path based - added value is no string', t => {
    const data = t.context.data;
    const schema = t.context.schema;
    JsonForms.rootData = data;

    const refData = {};
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    property.addToData(refData, {});
    t.deepEqual(refData, {});
});

test('Reference Array - path based - add to undefined', t => {
    const data = t.context.data;
    const schema = t.context.schemaArray;
    JsonForms.rootData = data;

    const refData = {};
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    property.addToData(refData, '#');
    t.deepEqual(refData, { ref: ['#']});
});

test('Reference Array - path based - add to defined', t => {
    const data = t.context.data;
    const schema = t.context.schemaArray;
    JsonForms.rootData = data;

    const refData = { ref: ['#/obj']};
    const service: SchemaService = new SchemaServiceImpl(schema);
    const property = service.getReferenceProperties(schema)[0];
    t.false(property.isIdBased());

    property.addToData(refData, '#');
    t.deepEqual(refData, { ref: ['#/obj', '#']});
});

test('Simple Schema - Root Scope', t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectionHelperMap('#', data, schema);

  const keys = Object.keys(paths);
  t.is(keys.length, 3);
  t.true(keys.indexOf('#') > -1);
  t.true(keys.indexOf('#/obj/arr/1') > -1);
  t.true(keys.indexOf('#/obj/ted') > -1);
  t.is(paths['#'], data);
  t.is(paths['#/obj/arr/1'], data.obj.arr[1]);
  t.is(paths['#/obj/ted'], data.obj.ted);
});

test('Simple Schema - Scoped', t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectionHelperMap('#/obj', data.obj, schema);

  const keys = Object.keys(paths);
  t.is(keys.length, 2);
  t.true(keys.indexOf('#/obj/arr/1') > -1);
  t.true(keys.indexOf('#/obj/ted') > -1);
  t.is(paths['#/obj/arr/1'], data.obj.arr[1]);
  t.is(paths['#/obj/ted'], data.obj.ted);
});

test('Simple Schema - Root Scope, undefined data', t => {
  const schema = t.context.simpleSchema;
  const paths = collectionHelperMap('#', undefined, schema);

  t.deepEqual(paths, {});
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
  const paths = collectionHelperMap('#', data, jsonSchemaFourMod);
  const keys = Object.keys(paths);
  t.is(keys.length, 5);
  t.true(keys.indexOf('#') > -1);
  t.true(keys.indexOf('#/properties/str') > -1);
  t.true(keys.indexOf('#/properties/obj') > -1);
  t.true(keys.indexOf('#/properties/obj/properties/cascStr') > -1);
  t.true(keys.indexOf('#/properties/obj/properties/cascNum') > -1);
  t.is(paths['#'], data);
  t.is(paths['#/properties/str'], data.properties.str);
  t.is(paths['#/properties/obj'], data.properties.obj);
  t.is(paths['#/properties/obj/properties/cascStr'], data.properties.obj.properties.cascStr);
  t.is(paths['#/properties/obj/properties/cascNum'], data.properties.obj.properties.cascNum);
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

  const paths = collectionHelperMap('#', data, jsonSchemaFourMod);
  const keys = Object.keys(paths);
  // path '#' indirectly contains a $ref and is therefore not valid
  t.is(keys.length, 4);
  t.true(keys.indexOf('#/properties/str') > -1);
  t.true(keys.indexOf('#/properties/obj') > -1);
  t.true(keys.indexOf('#/properties/obj/properties/cascStr') > -1);
  t.true(keys.indexOf('#/properties/obj/properties/cascNum') > -1);
  t.is(paths['#/properties/str'], data.properties.str);
  t.is(paths['#/properties/obj'], data.properties.obj);
  t.is(paths['#/properties/obj/properties/cascStr'], data.properties.obj.properties.cascStr);
  t.is(paths['#/properties/obj/properties/cascNum'], data.properties.obj.properties.cascNum);
});
