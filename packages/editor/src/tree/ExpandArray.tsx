// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  Paths,
  resolveData,
  UISchemaElement
} from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';
import { DropTarget, DropTargetMonitor } from 'react-dnd';
import {
  canDropDraggedItem,
  CSS,
  DragInfo,
  DropResult,
  mapDispatchToTreeListProps,
  Types } from './dnd.util';
import { ContainmentProperty, SchemaService } from '../services/schema.service';

export interface ExpandArrayProps {
  rootData: any;
  containmentProps: ContainmentProperty[];
  path: string;
  selection: any;
  schemaService: SchemaService;
  handlers: any;
  uischema: UISchemaElement;
}
/**
 * Expands the given data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * @param data the array to expand
 * @param property the {@link ContainmentProperty} defining the property that the array belongs to
 * @param parentPath the instance path where data can be obtained from
 */
export const ExpandArray = (
  {
    rootData,
    containmentProps,
    path,
    selection,
    schemaService,
    handlers,
    uischema
  }: ExpandArrayProps
) => {

  const data = resolveData(rootData, path);
  if (data === undefined || data === null) {
    // return 'No data';
    return '';
  }

  return (
    data.map((element, index) => {
      const composedPath = Paths.compose(path, index.toString());
      const property = schemaService.matchContainmentProperty(element, containmentProps);

      if (property === undefined || data === null) {
        return <li>No ContainmentProperty</li>;
      }

      return (
        <ObjectListItem
          key={composedPath}
          path={composedPath}
          schema={property.schema}
          selection={selection}
          handlers={handlers}
          uischema={uischema}
          schemaService={schemaService}
          parentProperties={containmentProps}
        />
      );
    })
  );
};

export interface ExpandArrayContainerProps extends ExpandArrayProps {
  connectDropTarget?: any;
  isOver?: boolean;
  validDropTarget?: boolean;
  moveListItem?(data: any, oldPath: string, newPath: string): boolean;
}

// TODO: update selected element once selection has been changed
export const ExpandArrayContainer = (
  {
    rootData,
    containmentProps,
    path,
    uischema,
    schemaService,
    selection,
    handlers,
    // Drag and Drop Parameters
    connectDropTarget,
    isOver, // hover over the list excluding nested lists
    // isOverNested, // hover over a nested listed but not this one
    validDropTarget,
  }: ExpandArrayContainerProps
) => {

  if (_.isEmpty(containmentProps)) {
    return undefined;
  }
  let className = '';
  if (validDropTarget) {
    className = CSS.DND_VALID_TARGET;
    if (isOver) {
      className = `${className} ${CSS.DND_CURRENT_TARGET}`;
    }
  } else if (isOver) {
    className = `${CSS.DND_INVALID_TARGET} ${CSS.DND_CURRENT_TARGET}`;
  }

  return connectDropTarget(
    <ul key={_.head(containmentProps).property} className={className}>
      <ExpandArray
        containmentProps={containmentProps}
        path={path}
        rootData={rootData}
        selection={selection}
        handlers={handlers}
        uischema={uischema}
        schemaService={schemaService}
      />
    </ul>
  );
};

const mapStateToProps = state => ({
  rootData: getData(state)
});

/**
 * Injects drag and drop related properties into an expanded array
 */
const collect = (dndConnect, monitor) => {
  return {
    connectDropTarget: dndConnect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    // isOverNested: !monitor.isOver( {shallow: true } && monitor.isOver({ shallow: false }),
    validDropTarget: monitor.canDrop()
  };
};

/**
 * The drop target contract for an expanded array.
 * The specified methods are executed by React DnD when appropriate
 * (e.g. a draggable component hovers over an expanded array).
 */
const arrayDropTarget = {
  /**
   * Tests wether the currently dragged object list item can be dropped in this list
   * by checking whether the item's schema id matches with a containment property of this list.
   */
  canDrop: (props: ExpandArrayContainerProps, monitor: DropTargetMonitor) => {
    return canDropDraggedItem(props.containmentProps, monitor.getItem() as DragInfo);
  },

  /**
   * Called when an item was dropped at a valid location (canDrop() === true)
   * The calls also go up the chain when the drop occurred in a nested component.
   * The most nested one is called first, return results are available
   * from the before called component.
   */
  drop: (props, monitor: DropTargetMonitor) => {
    // drop was handled by a nested list
    if (monitor.didDrop()) {
      return monitor.getDropResult();
    }

    // TODO remove console.log
    console.log('valid drop of data at: ' + props.path);

    const dropInfo: DropResult = {
      isHandled: true,
      move: true,
      moveTarget: Paths.compose(props.path, '0')
    };

    return dropInfo;
  }
};

const DnDExandArrayContainer =
  DropTarget(Types.TREE_DND, arrayDropTarget, collect)(ExpandArrayContainer);
export default connect(
  mapStateToProps,
  mapDispatchToTreeListProps
)(DnDExandArrayContainer);
