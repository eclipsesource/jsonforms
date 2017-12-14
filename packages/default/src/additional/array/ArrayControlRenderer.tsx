import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import {
  ControlElement,
  ControlProps,
  getData,
  Helpers,
  JsonForms,
  Paths,
  Resolve,
  update
} from '@jsonforms/core';
import { ArrayControl } from './ArrayControl';

export const getStyle = (styleName: string) =>
  JsonForms.stylingRegistry.getAsClassName(styleName);

export interface ArrayControlRendererProps extends ControlProps {
  addItem(path: string);
}

export const ArrayControlRenderer  =
  ({  schema, uischema, data, path, addItem }: ArrayControlRendererProps) => {

    const controlElement = uischema as ControlElement;
    const labelDescription = Helpers.createLabelDescriptionFrom(controlElement);
    const resolvedSchema = Resolve.schema(schema, controlElement.scope.$ref + '/items');
    const label = labelDescription.show ? labelDescription.text : '';

    const controlClassName =
      `control ${(Helpers.convertToValidClassName(controlElement.scope.$ref))}`;
    const fieldSetClassName = getStyle('array.layout');
    const buttonClassName = getStyle('array.button');
    const childrenClassName = JsonForms.stylingRegistry.getAsClassName('array.children');
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
