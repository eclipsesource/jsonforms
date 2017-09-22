/* tslint:disable:max-file-line-count */
import { test } from 'ava';
import {
  isContainmentProperty,
  isReferenceProperty,
  SchemaService
} from '../src/core/schema.service';
import { collectReferencePaths, SchemaServiceImpl } from '../src/core/schema.service.impl';
import { JsonSchema } from '../src/models/jsonSchema';
import { JsonForms } from '../src/core';

test.beforeEach(t => {
  t.context.simpleSchema = {
    properties: {
      a: { type: 'string' }
    },
    required: ['a']
  };
  t.context.data = {
    a: 'A'
    // obj: {
    //   // arr: [
    //   //   { i: 10 },
    //   //   { a: 'B'}
    //   // ],
    //   ted: {
    //     a: 'C'
    //   },
    //   uhu: {
    //     x: 2
    //   }
    // }
  };
});

test.only(t => {
  const data = t.context.data;
  const schema = t.context.simpleSchema;
  const paths = collectReferencePaths(data, '#', schema);

  t.true(Array.isArray(paths));
  console.log(paths);
  // t.is(paths.length, 3);
  // t.true(paths.indexOf('#') > -1);
  // t.true(paths.indexOf('#/obj/arr/1') > -1);
  // t.true(paths.indexOf('#/obj/ted') > -1);
});
