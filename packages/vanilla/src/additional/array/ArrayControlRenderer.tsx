import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import {
  ControlElement,
  getData,
  Helpers,
  Paths,
  Resolve,
  update
} from '@jsonforms/core';
import { ArrayControl } from './ArrayControl';
import {
  getStyle as style,
  getStyleAsClassName as styleAsClassName
} from '../../../../core/src/reducers';
import { VanillaControlProps } from '../../index';

export interface ArrayControlRendererProps extends VanillaControlProps {
  addItem(path: string);
}

const ArrayControlRenderer  =
  ({
     schema,
     uischema,
     data,
     path,
     addItem,
     getStyle,
     getStyleAsClassName
  }: ArrayControlRendererProps) => {

    const controlElement = uischema as ControlElement;
    const labelDescription = Helpers.createLabelDescriptionFrom(controlElement);
    const resolvedSchema = Resolve.schema(schema, controlElement.scope.$ref + '/items');
    const label = labelDescription.show ? labelDescription.text : '';

    const controlClassName =
      `control ${(Helpers.convertToValidClassName(controlElement.scope.$ref))}`;
    const fieldSetClassName = getStyle('array.layout');
    const buttonClassName = getStyle('array.button');
    const childrenClassName = getStyleAsClassName('array.children');
    const classNames = {
      wrapper: controlClassName,
      fieldSet: fieldSetClassName,
      button: buttonClassName,
      children: childrenClassName
    };

    return (
      <ArrayControl
        classNames={classNames}
        data={data}
        label={label}
        path={path}
        resolvedSchema={resolvedSchema}
        onAdd={addItem(path)}
      />
    );
  };

const mapStateToProps = (state, ownProps) => {
  const path = Paths.compose(Paths.fromScopable(ownProps.uischema), ownProps.path);

  return {
    data: Resolve.data(getData(state), path),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    getStyle: style(state),
    getStyleAsClassName: styleAsClassName(state),
    path
  };
};

const mapDispatchToProps = dispatch => ({
  addItem: (path: string) => () => {
    dispatch(
      update(
        path,
        array => {
          if (array === undefined || array === null) {
            return [{}];
          }

          const clone = _.clone(array);
          clone.push({});

          return clone;
        }
      )
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(ArrayControlRenderer);
