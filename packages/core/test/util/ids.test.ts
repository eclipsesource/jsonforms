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
import { clearAllIds, createId, Id, removeId } from '../../src/util/ids';

test.beforeEach(() => {
  clearAllIds();
});

test.serial('returns the proposed id when not yet taken', (t) => {
  t.is(createId('foo'), 'foo');
});

test.serial(
  'appends a suffix starting at 2 on subsequent calls with the same id',
  (t) => {
    t.is(createId('name'), 'name');
    t.is(createId('name'), 'name2');
    t.is(createId('name'), 'name3');
  }
);

test.serial(
  'avoids collisions across prefixes that would otherwise share an id',
  (t) => {
    t.is(createId('name'), 'name');
    t.is(createId('name'), 'name2');
    // proposed id 'name2' must not clash with the previously generated 'name2'
    t.is(createId('name2'), 'name22');
  }
);

test.serial('reuses ids that have been released via removeId', (t) => {
  const a = createId('item');
  const b = createId('item');
  const c = createId('item');
  t.deepEqual([a, b, c], ['item', 'item2', 'item3']);
  removeId(b);
  t.is(createId('item'), 'item2');
});

test.serial('removeId reports whether the id was tracked', (t) => {
  createId('foo');
  t.true(removeId('foo'));
  t.false(removeId('foo'));
  t.false(removeId('unknown'));
});

test.serial('clearAllIds resets the generator state', (t) => {
  createId('item');
  createId('item');
  clearAllIds();
  t.is(createId('item'), 'item');
});

test.serial(
  "falls back to 'undefined' when the proposed id is undefined",
  (t) => {
    t.is(createId(undefined as unknown as string), 'undefined');
    t.is(createId(undefined as unknown as string), 'undefined2');
  }
);

test.serial(
  'Id object exposes the same functions as the standalone exports',
  (t) => {
    t.is(Id.createId, createId);
    t.is(Id.removeId, removeId);
    t.is(Id.clearAllIds, clearAllIds);
  }
);

test.serial(
  'Id object routes through whatever methods are currently set',
  (t) => {
    const original = Id.createId;
    let calls = 0;
    Id.createId = (proposed) => {
      calls++;
      return `custom-${proposed}`;
    };
    try {
      t.is(Id.createId('foo'), 'custom-foo');
      t.is(calls, 1);
    } finally {
      Id.createId = original;
    }
  }
);
