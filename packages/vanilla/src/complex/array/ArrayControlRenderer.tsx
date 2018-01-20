import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { ControlElement, Helpers, Resolve, update } from '@jsonforms/core';
import { ArrayControl } from './ArrayControl';
import { mapStateToVanillaControlProps, VanillaControlProps } from '../../util';

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
     getStyleAsClassName,
     config
  }: ArrayControlRendererProps) => {

    const controlElement = uischema as ControlElement;
    const labelDescription = Helpers.createLabelDescriptionFrom(controlElement);
    const resolvedSchema = Resolve.schema(schema, controlElement.scope + '/items');
    const label = labelDescription.show ? labelDescription.text : '';

    const controlClassName =
      `control ${(Helpers.convertToValidClassName(controlElement.scope))}`;
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
        config={config}
      />
    );
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
  mapStateToVanillaControlProps,
  mapDispatchToProps)
(ArrayControlRenderer);
