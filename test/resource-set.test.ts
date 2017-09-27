// Tests for ResourceSetImpl
import { ResourceSetImpl } from '../src/core/resource-set';
import { test } from 'ava';

test('Test ResourceSetImpl', t => {
  const resourceSet = new ResourceSetImpl();

  const data1 = { a: 1 };
  const data2 = { b: 'hi' };
  const name1 = 'erni';
  t.false(resourceSet.hasResource(name1));

  const register1 = resourceSet.registerResource(name1, data1);
  t.is(register1, undefined);
  t.true(resourceSet.hasResource(name1));
  t.deepEqual(resourceSet.getResource(name1), data1);

  const register2 = resourceSet.registerResource(name1, data2);
  t.true(resourceSet.hasResource(name1));
  t.deepEqual(register2, data1);
  t.deepEqual(resourceSet.getResource(name1), data2);

  resourceSet.clear();
  t.false(resourceSet.hasResource(name1));
  t.is(resourceSet.getResource(name1), undefined);
});

test.cb('ResourceSetImpl - resolve references on registrations', t => {
  const resourceSet = new ResourceSetImpl();
  const data = {
    a: 1,
    b: { $ref: '#/a' },
    invalidRef: { $ref: '#/invalid' }
  };

  resourceSet.registerResource('data', data, true);
  setTimeout(
    ()  => {
      const res = resourceSet.getResource('data');
      const expected = {
        a: 1,
        b: 1,
        invalidRef: { $ref: '#/invalid' }
      };
      t.deepEqual(res, expected);
      t.end();
  },
    50);
});
