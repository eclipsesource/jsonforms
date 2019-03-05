// tslint:disable:jsx-no-multiline-js
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { connect } from 'react-redux';
import {
    getData,
    JsonFormsState,
    Paths,
    resolveData
} from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';
const { DropTarget }  = require('react-dnd');
import {
  canDropDraggedItem,
  CSS_DELAY,
  DragInfo,
  DropResult,
  mapDispatchToTreeListProps,
  Types } from './dnd.util';
import { Property } from '../services/property.util';
import { matchContainerProperty } from '../helpers/container.util';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { compose } from 'recompose';

export interface ExpandArrayProps {
  rootData: any;
  containmentProps?: Property[];
  path: string;
  selection: any;
  handlers: any;
  filterPredicate: any;
  labelProvider: any;
  imageProvider: any;
}
/**
 * Expands the given data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * @param data the array to expand
 * @param {@link Property} property It describes a single property.
 *        It is used to match a given data element with a schema by searching
 *        a list of properties.
 *
 * @param parentPath the instance path where data can be obtained from
 */
export const ExpandArray = (
  {
    rootData,
    containmentProps,
    path,
    selection,
    handlers,
    filterPredicate,
    labelProvider,
    imageProvider
  }: ExpandArrayProps
) => {

  const data = resolveData(rootData, path);
  if (data === undefined || data === null) {
    // return 'No data';
    return '';
  }
  return (
    data.map((element: any, index: number) => {
      const composedPath = Paths.compose(path, index.toString());
      const property = matchContainerProperty(element, containmentProps, filterPredicate);

      if (property === undefined) {
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
          labelProvider={labelProvider}
          imageProvider={imageProvider}
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
  classes?: any;
  moveListItem(data: any, oldPath: string, newPath: string): boolean;
}

export interface ExandArrayContainerState {
  /**
   * Defines whether CSS to highlight the list being a valid or invalid drop target should be shown.
   * This is necessary to prevent a Chrome bug that may cancel drag and drop prematurely
   * if the DOM is changed during the 'begin drag' event of HTML5.
   */
  setCss: boolean;
}

const styles: StyleRulesCallback<'currentTarget' | 'validTarget' | 'invalidTarget'> = () => ({
  currentTarget: {
    borderWidth:  'medium'
  },
  validTarget: {
    borderStyle: 'dashed',
    borderWidth: 'thin',
    borderColor: 'rgb(88, 199, 23)',
    minHeight: '1em'
  },
  invalidTarget: {
    borderStyle: 'dashed',
    borderWidth: 'thin',
    borderColor: 'rgb(189, 0, 0)'
  }
});

class ExpandArrayContainer extends
  React.Component<ExpandArrayContainerProps &
                  WithStyles<'currentTarget' | 'validTarget' | 'invalidTarget'>,
                  any> {

  constructor(props: ExpandArrayContainerProps &
                  WithStyles<'currentTarget' | 'validTarget' | 'invalidTarget'>) {
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
      filterPredicate,
      labelProvider,
      imageProvider,
      classes
    }: ExpandArrayContainerProps = this.props;

    if (isEmpty(containmentProps)) {
      return undefined;
    }

    let className = '';
    // Only apply D&D CSS if the flag has been set
    if (this.state.setCss) {
      if (validDropTarget) {
        className = classes.validTarget;
        if (isOver) {
          className = `${className} ${classes.currentTarget}`;
        }
      } else if (isOver) {
        className = `${classes.invalidTarget} ${classes.currentTarget}`;
      }
    }

    return connectDropTarget(
      <ul key={head(containmentProps).property} className={className}>
        <ExpandArray
          containmentProps={containmentProps}
          path={path}
          rootData={rootData}
          selection={selection}
          handlers={handlers}
          filterPredicate={filterPredicate}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
        />
      </ul>
    );
  }
}

const mapStateToProps = (state: JsonFormsState) => ({
  rootData: getData(state)
});

/**
 * Injects drag and drop related properties into an expanded array
 */
    // TODO: typings
const collect = (dndConnect: any, monitor: any) => {
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
  canDrop: (props: ExpandArrayContainerProps, monitor: any) => {
    return canDropDraggedItem(props.containmentProps, monitor.getItem() as DragInfo);
  },

  /**
   * Called when an item was dropped at a valid location (canDrop() === true)
   * The calls also go up the chain when the drop occurred in a nested component.
   * The most nested one is called first, return results are available
   * from the before called component.
   */
  drop: (props: any, monitor: any) => {
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

const DnDExandArrayContainer = compose<ExpandArrayContainerProps, ExpandArrayContainerProps>(
  withStyles(styles, { name: 'ExpandArrayContainer' }),
  DropTarget(Types.TREE_DND, arrayDropTarget, collect)
)(ExpandArrayContainer);

export default connect(
  mapStateToProps,
  mapDispatchToTreeListProps
)(DnDExandArrayContainer);
