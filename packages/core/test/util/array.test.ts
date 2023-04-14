import { moveDown, moveUp } from '../../src/util/';
import anyTest, { TestInterface } from 'ava';

const test = anyTest as TestInterface<{ array: number[] }>;

test.beforeEach((t) => {
  t.context.array = [1, 2, 3, 4, 5];
});

test('Move up should move item up by one index', (t) => {
  moveUp(t.context.array, 2);
  t.deepEqual(t.context.array, [1, 3, 2, 4, 5]);
});

test('Move up should not change array if item to move is the first item ', (t) => {
  moveUp(t.context.array, 0);
  t.deepEqual(t.context.array, [1, 2, 3, 4, 5]);
});

test('Move down should move item down by one index', (t) => {
  moveDown(t.context.array, 2);
  t.deepEqual(t.context.array, [1, 2, 4, 3, 5]);
});

test('Move down should not change array if item to move is the last item ', (t) => {
  moveDown(t.context.array, 4);
  t.deepEqual(t.context.array, [1, 2, 3, 4, 5]);
});
