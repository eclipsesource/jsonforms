const move = function(array: Array<any>, index: number, delta: number) {
  const newIndex: number = index + delta;
  if (newIndex < 0 || newIndex >= array.length) return; //Already at the top or bottom.
  var indexes: number[] = [index, newIndex].sort(); //Sort the indixes
  array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
};

var moveUp = function(array: Array<any>, toMove: number) {
  move(array, toMove, -1);
};

var moveDown = function(array: Array<any>, toMove: number) {
  move(array, toMove, 1);
};

export { moveUp, moveDown };
