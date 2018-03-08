/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import * as React from 'react';

import {
  ControlElement,
  Helpers,
  mapDispatchToTableControlProps,
  mapStateToControlProps,
  Resolve,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
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
    const resolvedSchema = Resolve.schema(schema, `${controlElement.scope}/items`);
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
