import { moveUp, moveDown } from '../../src/util/';
import test from 'ava';
let array: Array<number> = [];
test.beforeEach(() => {
  array = [1, 2, 3, 4, 5];
});

test('Move up should move item up by one index', t => {
  moveUp(array, 2);
  t.deepEqual(array, [1, 3, 2, 4, 5]);
});

test('Move up should not change array if item to move is the first item ', t => {
  moveUp(array, 0);
  t.deepEqual(array, [1, 2, 3, 4, 5]);
});

test('Move down should move item down by one index', t => {
  moveDown(array, 2);
  t.deepEqual(array, [1, 2, 4, 3, 5]);
});

test('Move down should not change array if item to move is the last item ', t => {
  moveDown(array, 4);
  t.deepEqual(array, [1, 2, 3, 4, 5]);
});
