// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  Paths,
  resolveData
} from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';
import { DropTarget, DropTargetMonitor } from 'react-dnd';
import {
  canDropDraggedItem,
  CSS,
  CSS_DELAY,
  DragInfo,
  DropResult,
  mapDispatchToTreeListProps,
  Types } from './dnd.util';
import { Property } from '../services/property.util';
import { matchContainmentProperty } from '../helpers/containment.util';

export interface ExpandArrayProps {
  rootData: any;
  containmentProps: Property[];
  path: string;
  selection: any;
  handlers: any;
  filterPredicate: any;
}
/**
 * Expands the given data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * @param data the array to expand
 * @param property the {@link Property} defining the property that the array belongs to
 * @param parentPath the instance path where data can be obtained from
 */
export const ExpandArray = (
  {
    rootData,
    containmentProps,
    path,
    selection,
    handlers,
    filterPredicate
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
      const property = matchContainmentProperty(element, containmentProps, filterPredicate);

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
          parentProperties={containmentProps}
          filterPredicate={filterPredicate}
        />
      );
    })
  );
};

export interface ExpandArrayContainerProps extends ExpandArrayProps {
  connectDropTarget?: any;
  /** True if drag and drop is currently in progress. */
  isDragging?: boolean;
  /** The dragged element is over this expanded array excluding nested arrays. */
  isOver?: boolean;
  /** Whether this list is a valid drop target for the currently dragged element. */
  validDropTarget?: boolean;
  moveListItem?(data: any, oldPath: string, newPath: string): boolean;
}

export interface ExandArrayContainerState {
  /**
   * Defines whether CSS to highlight the list being a valid or invalid drop target should be shown.
   * This is necessary to prevent a Chrome bug that may cancel drag and drop prematurely
   * if the DOM is changed during the 'begin drag' event of HTML5.
   */
  setCss: boolean;
}

export class ExpandArrayContainer extends React.Component<ExpandArrayContainerProps,
                                                          ExandArrayContainerState> {

  constructor(props) {
    super(props);
    this.state = { setCss: false };
  }

  componentWillReceiveProps(nextProps: ExpandArrayContainerProps) {
    if (this.props.isDragging && !nextProps.isDragging) {
      this.setState( { setCss: false });
    } else if (!this.props.isDragging && nextProps.isDragging) {
      setTimeout(() => this.setState({ setCss: true }), CSS_DELAY);
    }
  }

  render() {
    const {
      rootData,
      containmentProps,
      path,
      selection,
      handlers,
      // Drag and Drop Parameters
      connectDropTarget,
      isOver,
      validDropTarget,
      filterPredicate
    }: ExpandArrayContainerProps = this.props;

    if (_.isEmpty(containmentProps)) {
      return undefined;
    }

    let className = '';
    // Only apply D&D CSS if the flag has been set
    if (this.state.setCss) {
      if (validDropTarget) {
        className = CSS.DND_VALID_TARGET;
        if (isOver) {
          className = `${className} ${CSS.DND_CURRENT_TARGET}`;
        }
      } else if (isOver) {
        className = `${CSS.DND_INVALID_TARGET} ${CSS.DND_CURRENT_TARGET}`;
      }
    }

    return connectDropTarget(
      <ul key={_.head(containmentProps).property} className={className}>
        <ExpandArray
          containmentProps={containmentProps}
          path={path}
          rootData={rootData}
          selection={selection}
          handlers={handlers}
          filterPredicate={filterPredicate}
        />
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  rootData: getData(state)
});

/**
 * Injects drag and drop related properties into an expanded array
 */
const collect = (dndConnect, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: dndConnect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    validDropTarget: monitor.canDrop(),
    isDragging: monitor.getItem() !== null
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
