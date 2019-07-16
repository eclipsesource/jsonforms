const move = (array: any[], index: number, delta: number) => {
  const newIndex: number = index + delta;
  if (newIndex < 0 || newIndex >= array.length) {
    return;
  } // Already at the top or bottom.
  const indexes: number[] = [index, newIndex].sort((a, b) => a - b); // Sort the indixes
  array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
};

const moveUp = (array: any[], toMove: number) => {
  move(array, toMove, -1);
};

const moveDown = (array: any[], toMove: number) => {
  move(array, toMove, 1);
};

export { moveUp, moveDown };
