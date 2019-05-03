/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
import React from 'react';

import {
    ArrayControlProps,
    ControlElement,
    Helpers
} from '@jsonforms/core';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { ArrayControl } from './ArrayControl';
import { withVanillaControlProps } from '../../util';
import { VanillaRendererProps } from '../../index';

const ArrayControlRenderer =
    ({
        schema,
        uischema,
        data,
        path,
        rootSchema,
        uischemas,
        addItem,
        getStyle,
        getStyleAsClassName,
        removeItems,
        id,
        visible,
        enabled,
        errors
    }: ArrayControlProps & VanillaRendererProps) => {

        const controlElement = uischema as ControlElement;
        const labelDescription = Helpers.createLabelDescriptionFrom(controlElement, schema);
        const label = labelDescription.show ? labelDescription.text : '';
        const controlClassName =
            `control ${(Helpers.convertToValidClassName(controlElement.scope))}`;
        const fieldSetClassName = getStyleAsClassName('array.layout');
        const buttonClassName = getStyleAsClassName('array.button');
        const childrenClassName = getStyleAsClassName('array.children');
        const classNames: { [className: string]: string } = {
            wrapper: controlClassName,
            fieldSet: fieldSetClassName,
            button: buttonClassName,
            children: childrenClassName
        };

        return (
            <ArrayControl
                errors={errors}
                getStyle={getStyle}
                getStyleAsClassName={getStyleAsClassName}
                removeItems={removeItems}
                classNames={classNames}
                data={data}
                label={label}
                path={path}
                addItem={addItem}
                uischemas={uischemas}
                uischema={uischema}
                schema={schema}
                rootSchema={rootSchema}
                id={id}
                visible={visible}
                enabled={enabled}
            />
        );
    };

export default withVanillaControlProps(withJsonFormsArrayControlProps(ArrayControlRenderer));
