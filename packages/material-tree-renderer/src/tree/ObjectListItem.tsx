// tslint:disable:jsx-no-multiline-js
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import initial from 'lodash/initial';
import groupBy from 'lodash/groupBy';
import { indexFromPath } from '../helpers/util';
import React from 'react';
import { connect } from 'react-redux';
import {
    getData,
    getSchema, JsonFormsState,
    JsonSchema7,
    Paths,
    resolveData,
    update
} from '@jsonforms/core';
import ExpandArray from './ExpandArray';
import { findContainerProperties, Property } from '../services/property.util';
const { DragSource, DropTarget } = require('react-dnd');
import {
  canDropDraggedItem,
  DragInfo,
  DropResult,
  moveListItem,
  Types } from './dnd.util';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { compose } from 'recompose';
import { wrapImageIfNecessary } from '../helpers/image-provider.util';
import { InstanceLabelProvider } from '../helpers/LabelProvider';
import { AnyAction, Dispatch } from 'redux';

/**
 * The delay (in milliseconds) between removing this object list item's data from the store
 * and resetting the selection.
 * This is necessary because without a delay the resetted selection is overwritten
 * by the on click handler of this object list item which sets the selection to this item.
 */
const RESET_SELECTION_DELAY = 40;

const styles:
  StyleRulesCallback<'listItem' |
                     'withoutBorders' |
                     'itemContainer' |
                     'label' |
                     'actionButton' |
                     'selected'> = theme => ({
  listItem: {
    minHeight: '1em',
    position: 'relative',
    paddingLeft: '1.5em', // tslint:disable-next-line:object-literal-key-quotes
    '&:before': {
      content: '""',
      position: 'absolute',
      left: '0.2em',
      top: '0.5em',
      width: '1em'
    }, // tslint:disable-next-line:object-literal-key-quotes
    '&:after': {
      content: '""',
      position: 'absolute',
      left: '0.2em',
      top: '-0.5em',
      height: '100%'
    }
  },
  withoutBorders: { // tslint:disable-next-line:object-literal-key-quotes
    '&:last-child:after': {
      display: 'none'
    }, // tslint:disable-next-line:object-literal-key-quotes
    '&:only-child': {
      paddingLeft: '0.25em'
    }, // tslint:disable-next-line:object-literal-key-quotes
    '&:only-child:before': {
      display: 'none'
    }
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row', // tslint:disable-next-line:object-literal-key-quotes
    '& .icon': {
      flexBasis: '1em',
      minHeight: '1em',
      marginRight: '0.25em',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }, // tslint:disable-next-line:object-literal-key-quotes
    '&:hover': {
      fontWeight: 'bold',
      cursor: 'pointer',
      opacity: 0.9,
      backgroundColor: theme.palette.secondary.main,
    },
    alignItems: 'center'
  },
  label: {
    display: 'flex',
    flex: 1,
    marginRight: '1em',
    minHeight: '1.5em',
    alignItems: 'center', // tslint:disable-next-line:object-literal-key-quotes
    '& span:first-child:empty': {
      background: '#ffff00',
      maxHeight: '1.5em'
    }, // tslint:disable-next-line:object-literal-key-quotes
    '&:hover $actionButton': {
      display: 'flex',
      justifyContent: 'center', // tslint:disable-next-line:object-literal-key-quotes
      '&:hover': {
        color: 'white',
        backgroundColor: theme.palette.secondary.dark,
        borderRadius: '50%'
      }
    }
  },
  actionButton: {
    display: 'none',
    cursor: 'pointer',
    marginLeft: '0.25em',
    fontWeight: 'normal',
    width: 'inherit',
    height: 'inherit'
  },
  selected: {
    fontWeight: 'bold'
  }
});

/**
 * Represents an item within the master view.
 */
export interface ObjectListItemProps {
  path: string;
  schema: JsonSchema7;
  rootData: any;
  data: any;
  selection: any;
  handlers: {
    onRemove?: any;
    onAdd: any;
    onSelect: any;
  };
  filterPredicate: any;
  /**
   * Self contained schemas of the corresponding schema
   */
  containerProperties?: Property[];
  imageProvider: any;
  labelProvider: InstanceLabelProvider;
}

class ObjectListItem extends React.Component
  <ObjectListItemProps &
    WithStyles<'listItem' |
               'withoutBorders' |
               'itemContainer' |
               'label' |
               'actionButton' |
               'selected'>, {}> {

  render() {
    const {
        path,
        schema,
        rootData,
        data,
        handlers,
        selection,
        filterPredicate,
        containerProperties,
        labelProvider,
        imageProvider,
        classes
    } = this.props;
    const pathSegments = path.split('.');
    const parentPath = initial(pathSegments).join('.');
    const labelClass = selection === data ? classes.selected : '';
    const hasParent = !isEmpty(parentPath);
    const liClass =
      !hasParent ? [classes.listItem, classes.withoutBorders].join(' ') : classes.listItem;
    const scopedData = resolveData(rootData, parentPath);
    const groupedProps = groupBy(containerProperties, property => property.property);

    return (
      <li
        className={liClass}
        key={path}
      >
        <div className={classes.itemContainer}>
          {wrapImageIfNecessary(imageProvider(schema))}

          <span
            className={classes.label}
            onClick={handlers.onSelect(schema, data, path)}
          >
          <Typography className={labelClass}>
              {labelProvider(schema, data, path)}
          </Typography>
            {
              !isEmpty(containerProperties) ?
                (
                  <IconButton
                    className={classes.actionButton}
                    aria-label='Add'
                    onClick={handlers.onAdd(schema, path)}
                  >
                    <AddIcon />
                  </IconButton>
                ) : ''
            }
            {
              (hasParent || Array.isArray(scopedData)) &&
              <IconButton
                className={classes.actionButton}
                aria-label='Remove'
                onClick={handlers.onRemove}
              >
                <DeleteIcon />
              </IconButton>
            }
          </span>
        </div>
        {
          Object.keys(groupedProps).map(groupKey =>
            <ExpandArray
              key={groupKey}
              containmentProps={groupedProps[groupKey]}
              path={Paths.compose(path, groupKey)}
              selection={selection}
              handlers={handlers}
              filterPredicate={filterPredicate}
              labelProvider={labelProvider}
              imageProvider={imageProvider}
            />
          )
        }
      </li>
    );
  }
}

// TODO
const mapStateToProps = (state: JsonFormsState, ownProps: any) => {
  const index = indexFromPath(ownProps.path);
  const containerProperties: Property[] = findContainerProperties(
      ownProps.schema,
      getSchema(state) as JsonSchema7,
      false
  );

  return {
    index: index,
    rootData: getData(state),
    rootSchema: getSchema(state),
    containerProperties
  };
};

// TODO
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, ownProps: any) => {

  const parentPath = initial(ownProps.path.split('.')).join('.');
  const index = indexFromPath(ownProps.path);

  return {
    remove() {
      dispatch(
        update(
          parentPath,
          array => {
            const clonedArray = clone(array);
            clonedArray.splice(index, 1);
            return clonedArray;
          }
        )
      );
    },
    moveListItem: moveListItem(dispatch)
  };
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
  const data = resolveData(stateProps.rootData, ownProps.path);
  let resetSelection = ownProps.handlers.resetSelection;
  resetSelection = resetSelection ? resetSelection : (): any => undefined;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data,
    handlers: {
      ...ownProps.handlers,
      onRemove() {
        const result = dispatchProps.remove(data);
        // Need to reset the selection with a delay because otherwise it gets overwritten
        // by the on click handler of the item also setting the selection.
        setTimeout(resetSelection, RESET_SELECTION_DELAY);
        return result;
      }
    }
  };
};

const ListItem = compose<ObjectListItemProps, ObjectListItemProps>(
  withStyles(styles, { name: 'ObjectListItem' }),
)(ObjectListItem);

export interface ObjectListItemDndProps extends ObjectListItemProps {
  moveListItem: any;
  isRoot?: boolean;
  /**
   * The Containment Properties of the parent list containing this item.
   * Will be needed to determine whether another list item can be dropped next to this one.
   */
  parentProperties?: Property[];
  // Drag and Drop:
  isDragging: boolean;
  connectDragSource: any;
  connectDropTarget: any;
}

export class ObjectListItemDnd extends React.Component<ObjectListItemDndProps, any> {
    render() {
        const {
            path,
            schema,
            rootData,
            data,
            handlers,
            selection,
            isRoot,
            // isDragging,
            connectDragSource,
            connectDropTarget,
            filterPredicate,
            containerProperties,
            labelProvider,
            imageProvider,
        }: ObjectListItemDndProps = this.props;

        const listItem = (
            <ListItem
                path={path}
                schema={schema}
                rootData={rootData}
                data={data}
                handlers={handlers}
                selection={selection}
                filterPredicate={filterPredicate}
                containerProperties={containerProperties}
                labelProvider={labelProvider}
                imageProvider={imageProvider}
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
    }
}

/**
 * Define the drag and drop source (item is dragged) behavior of the list items
 */
const objectDragSource = {
  beginDrag(props: any) {
    const dragInfo: DragInfo = {
      originalPath: props.path,
      currentPath: props.path,
      data: props.data,
      schema: props.schema
    };

    console.log('drag started', props.path);

    return dragInfo;
  },

  endDrag(props: ObjectListItemDndProps, monitor: any) {
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
const collectDragSource = (dndConnect: any, monitor: any) => {
  return {
    connectDragSource: dndConnect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

/**
 * Injects drag and drop (drop target) related properties into a list item
 */
const collectDropTarget = (dndConnect: any, monitor: any) => {
  return {
    isOver: monitor.isOver({ shallow: true }),
    connectDropTarget: dndConnect.dropTarget()
  };
};

/**
 * Define the drag and drop target (another item is dragged over this item) behavior of list items.
 */
const objectDropTarget = {
  canDrop: (props: any, monitor: any) => {
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
  hover(props: ObjectListItemDndProps, monitor: any) {
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
