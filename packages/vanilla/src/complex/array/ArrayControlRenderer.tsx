import * as React from 'react';

import {
  connectToJsonForms,
  ControlElement,
  Helpers,
  mapDispatchToTableControlProps,
  mapStateToControlProps,
  Resolve,
} from '@jsonforms/core';
import { ArrayControl } from './ArrayControl';
import { VanillaControlProps } from '../../index';
import { addVanillaControlProps } from '../../util';

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
      />
    );
  };

const ConnectedArrayControlRenderer = connectToJsonForms(
  addVanillaControlProps(mapStateToControlProps),
  mapDispatchToTableControlProps
)(ArrayControlRenderer);

export default ConnectedArrayControlRenderer;
