import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import { JsonSchema7, update } from '@jsonforms/core';
import { Property } from '../services/property.util';
import { indexFromPath, parentPath } from '../helpers/util';
import { AnyAction, Dispatch } from 'redux';

export const Types = {
  TREE_DND: 'tree-master-detail-DnD'
};

/**
 * The delay in milliseconds before D&D related CSS (e.g. highlighting valid drop targets) is
 * applied.
 */
export const CSS_DELAY = 30;

/**
 * Information about a currently dragged data object.
 */
export interface DragInfo {
  /** The path where the data object was located before the drag started. */
  originalPath: string;
  /**
   * The current path of the dragged data object.
   * This is updated when the dragged data is moved while dragging it
   * and needed to move it back to its original position in case the drag is cancelled.
   *
   * This is initialized with the originalPath.
   */
  currentPath: string;
  /** The JsonSchema defining the dragged data object */
  schema: JsonSchema7;
  /** The data object itself */
  data: any;
}

/**
 * Information about the handling of a drop event
 */
export interface DropResult {
  /**
   * Whether the drop event was handled by a list or list item.
   * If true, the dragged item was already moved to its target location
   * and further drop handlers do not need to act.
   */
  isHandled: boolean;

  /**
   * Whether the dragged item still needs to be moved
   */
  move?: boolean;

  /**
   * The path where the dragged item will be moved if it should be moved
   */
  moveTarget?: string;
}

/**
 * Moves the given data from the oldPath to the newPath by deleting the data object at the old path
 * and inserting the data at the new path.
 *
 * Note: an item at the index of the new path is pushed behind the inserted item
 *
 * @param dispatch the redux dispatcher used to execute the remove and add actions
 * @param data the data to move (insert at new path)
 * @param oldPath the data at this path will be deleted
 * @param newPath the given data will be inserted at this path
 */
export const moveListItem = (dispatch: Dispatch<AnyAction>) => (
  data: any,
  oldPath: string,
  newPath: string
): boolean => {
  if (newPath === oldPath) {
    // nothing needs to be moved
    return false;
  }

  const oldParentPath = parentPath(oldPath);
  const oldIndex = indexFromPath(oldPath);
  const newParentPath = parentPath(newPath);
  const newIndex = indexFromPath(newPath);

  // Remove moved data from source array
  dispatch(
    update(oldParentPath, array => {
      // TODO clone necessary?
      const clonedArray = clone(array);
      clonedArray.splice(oldIndex, 1);

      console.log(`remove from ${oldParentPath}, index: ${oldIndex}`);

      return clonedArray;
    })
  );

  // Add moved data to target array
  dispatch(
    update(newParentPath, array => {
      if (array === undefined || array === null || array.length === 0) {
        return [data];
      }

      // TODO clone necessary?
      const clonedArray = clone(array);
      clonedArray.splice(newIndex, 0, data);

      console.log(`add to ${newParentPath}, index: ${newIndex}`);

      return clonedArray;
    })
  );

  return true;
};

export const mapDispatchToTreeListProps = (dispatch: Dispatch<AnyAction>) => ({
  moveListItem: moveListItem(dispatch)
});

/**
 * Returns whether the dragged item can be dropped in a list.
 *
 * @param containerProps The ContainmentProperties that the list can supports
 * @param dragInfo The DragInfo describing the dragged item
 */
export const canDropDraggedItem = (
  containerProps: Property[],
  dragInfo: DragInfo
) => {
  const matchingProps = containerProps.filter(prop =>
    isEqual(prop.schema, dragInfo.schema)
  );
  return matchingProps.length > 0;
};
