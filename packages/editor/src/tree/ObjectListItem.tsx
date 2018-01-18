// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  JsonSchema,
  Paths,
  resolveData,
  UISchemaElement,
  update
} from '@jsonforms/core';
import ExpandArray from './ExpandArray';
import { ContainmentProperty, SchemaService } from '../services/schema.service';
import {
  DragSource,
  DragSourceMonitor,
  DropTarget,
  DropTargetMonitor } from 'react-dnd';
import {
  canDropDraggedItem,
  DragInfo,
  DropResult,
  indexFromPath,
  moveListItem,
  Types } from './dnd.util';

const getNamingFunction =
  (schema: JsonSchema, uischema: UISchemaElement) => (element: Object): string => {
    if (uischema.options !== undefined) {
      const labelProvider = uischema.options.labelProvider;
      if (labelProvider !== undefined && labelProvider[schema.id] !== undefined) {
        return element[labelProvider[schema.id]];
      }
    }

    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element[namingKeys[0]];
    }

    return JSON.stringify(element);
  };

export interface ObjectListItemProps {
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
  rootData: any;
  data: any;
  selection: any;
  handlers: {
    onRemove?: any;
    onAdd: any;
    onSelect: any;
  };
  schemaService: SchemaService;
}

const ObjectListItem = (
  {
    path,
    schema,
    uischema,
    rootData,
    data,
    handlers,
    selection,
    schemaService
  }: ObjectListItemProps) => {

  const pathSegments = path.split('.');
  const parentPath = _.initial(pathSegments).join('.');
  const liClasses = selection === data ? 'selected' : '';
  const hasParent = !_.isEmpty(parentPath);
  const scopedData = resolveData(rootData, parentPath);
  const containmentProps = schemaService.getContainmentProperties(schema);
  const groupedProps = _.groupBy(containmentProps, property => property.property);

  // TODO: key should be set in caller
  return (
    <li className={liClasses} key={path}>
      <div>
        {
          _.has(uischema.options, 'imageProvider') ?
            <span className={`icon ${uischema.options.imageProvider[schema.id]}`} /> : ''
        }

        <span
          className='label'
          onClick={handlers.onSelect(schema, data, path)}
        >
          <span>
            {getNamingFunction(schema, uischema)(data)}
          </span>
          {
            schemaService.hasContainmentProperties(schema) ?
              (
                <span
                  className='add'
                  onClick={handlers.onAdd(schema, path)}
                >
                  {'\u2795'}
                </span>
              ) : ''
          }
          {
            (hasParent || _.isArray(scopedData)) &&
            <span
              className='remove'
              onClick={handlers.onRemove}
            >
              {'\u274C'}
            </span>
          }
        </span>
      </div>
      {
        Object.keys(groupedProps).map(groupKey =>
          <ExpandArray
            key={groupKey}
            containmentProps={groupedProps[groupKey]}
            path={Paths.compose(path, groupKey)}
            schema={schema}
            selection={selection}
            uischema={uischema}
            handlers={handlers}
            schemaService={schemaService}
          />
      )
    }
    </li>
  );
};

const mapStateToProps = (state, ownProps) => {
  const index = indexFromPath(ownProps.path);

  return {
    index: index,
    rootData: getData(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  const parentPath = _.initial(ownProps.path.split('.')).join('.');

  return {
    remove(data) {
      dispatch(
        update(
          parentPath,
          array => _.filter(array.slice(), el => !_.isEqual(el, data))
        )
      );
    },
    moveListItem: moveListItem(dispatch)
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const data = resolveData(stateProps.rootData, ownProps.path);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data,
    handlers: {
      ...ownProps.handlers,
      onRemove() {
        return dispatchProps.remove(data);
      }
    }
  };
};

export interface ObjectListItemDndProps extends ObjectListItemProps {
  moveListItem: any;
  isRoot?: boolean;
  /**
   * The Containment Properties of the parent list containing this item.
   * Will be needed to determine whether another list item can be dropped next to this one.
   */
  parentProperties?: ContainmentProperty[];
  // Drag and Drop:
  isDragging: boolean;
  connectDragSource;
  connectDropTarget;
}

const ObjectListItemDnd = (
  {
    path,
    schema,
    uischema,
    rootData,
    data,
    handlers,
    selection,
    schemaService,
    isRoot,
    // isDragging,
    connectDragSource,
    connectDropTarget
  }: ObjectListItemDndProps
) => {
  const listItem = (
    <ObjectListItem
      path={path}
      schema={schema}
      uischema={uischema}
      rootData={rootData}
      data={data}
      handlers={handlers}
      selection={selection}
      schemaService={schemaService}
    />
  );
  if (isRoot === true) {
    // No Drag and Drop
    return listItem;
  }

  // const opacity = isDragging ? 0.2 : 1;

  // wrap in div because react-dnd does not allow directly connecting to components
  return connectDragSource(
    connectDropTarget(<div>{listItem}</div>));
};

/**
 * Define the drag and drop source (item is dragged) behavior of the list items
 */
const objectDragSource = {
  beginDrag(props, _monitor: DragSourceMonitor, _component) {
    const dragInfo: DragInfo = {
      originalPath: props.path,
      currentPath: props.path,
      data: props.data,
      schema: props.schema
    };

    console.log('drag started', props.path);

    return dragInfo;
  },

  endDrag(props: ObjectListItemDndProps, monitor: DragSourceMonitor) {
    const dragInfo = monitor.getItem() as DragInfo;
    const dropInfo = monitor.getDropResult() as DropResult;

    console.log(`End Drag; monitor.didDrop(): ${monitor.didDrop()}`);
    if (!monitor.didDrop()) {
      // List item was not successfully dropped => revert to original position if it was moved
      if (dragInfo.originalPath !== dragInfo.currentPath) {
        console.log(`No valid drop. Revert position. Original: ${dragInfo.originalPath}.` +
                    `Current: ${dragInfo.currentPath}`);
        props.moveListItem(dragInfo.data, dragInfo.currentPath, dragInfo.originalPath);
      }

    } else if (dropInfo.move) {
      console.log(`Drop in endDrag. Move Target: ${dropInfo.moveTarget}`);
      props.moveListItem(dragInfo.data, dragInfo.currentPath, dropInfo.moveTarget);
    }
  }
};

/**
 * Injects drag and drop (drag source) related properties into a list item
 */
const collectDragSource = (dndConnect, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: dndConnect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

/**
 * Injects drag and drop (drop target) related properties into a list item
 */
const collectDropTarget = (dndConnect, monitor: DropTargetMonitor) => {
  return {
    isOver: monitor.isOver({ shallow: true }),
    connectDropTarget: dndConnect.dropTarget()
  };
};

/**
 * Define the drag and drop target (another item is dragged over this item) behavior of list items.
 */
const objectDropTarget = {
  canDrop: (props, monitor: DropTargetMonitor) => {
    return canDropDraggedItem(props.parentProperties, monitor.getItem() as DragInfo);
  },

  /**
   * On drop of a dragged item on another dragged item, mark the drop as handled
   * and that the item does not need to be moved.
   * This is the case because the item is already moved on hover.
   */
  drop: () => {
    const dropInfo: DropResult = {
      isHandled: true,
      move: false
    };

    return dropInfo;
  },

  /**
   * If the dragged item can be dropped in the list of the hovered item, move it there on the fly.
   *
   * @param props The properties of the hovered list element
   * @param monitor
   */
  hover(props: ObjectListItemDndProps, monitor: DropTargetMonitor) {
    if (!monitor.isOver({shallow: true})) {
      return;
    }
    if (!monitor.canDrop()) {
      return;
    }

    const dragInfo = monitor.getItem() as DragInfo;
    if (props.path === dragInfo.currentPath) {
      return;
    }

    // move list item and update current path of the currently dragged item
    const targetPath = props.path;
    const moved = props.moveListItem(dragInfo.data, dragInfo.currentPath, targetPath);
    if (moved) {
      dragInfo.currentPath = targetPath;
      console.log('new current path: ' + dragInfo.currentPath);
    }
  }
};

/**
 * Configure a list item as a drop target and a drag source.
 * Drop Target: Allows to drop other list items on this list item and is necessary
 * to sort elements inside a list
 *
 * Drag Source: Allows to drag a list item
 */
const listItemDnd =
  DropTarget(Types.TREE_DND, objectDropTarget, collectDropTarget)
    (DragSource(Types.TREE_DND, objectDragSource, collectDragSource)(ObjectListItemDnd));
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(listItemDnd);
