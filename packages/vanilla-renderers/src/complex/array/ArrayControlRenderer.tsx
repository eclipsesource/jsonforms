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
import range from 'lodash/range';
import React, { useMemo } from 'react';
import {
  ArrayControlProps,
  composePaths,
  createDefaultValue,
  findUISchema,
  Helpers,
  ControlElement,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  withJsonFormsArrayControlProps,
} from '@jsonforms/react';
import type { VanillaRendererProps } from '../../index';
import { withVanillaControlProps } from '../../util';

const { convertToValidClassName } = Helpers;

export const ArrayControl = ({
  classNames,
  data,
  label,
  path,
  schema,
  errors,
  addItem,
  removeItems,
  moveUp,
  moveDown,
  uischema,
  uischemas,
  getStyleAsClassName,
  renderers,
  rootSchema,
  translations,
}: ArrayControlProps & VanillaRendererProps) => {
  const controlElement = uischema as ControlElement;
  const childUiSchema = useMemo(
    () =>
      findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );
  const isValid = errors.length === 0;
  const validationClass = getStyleAsClassName('array.control.validation');
  const divClassNames = [validationClass]
    .concat(
      isValid ? '' : getStyleAsClassName('array.control.validation.error')
    )
    .join(' ');
  const buttonClassAdd = getStyleAsClassName('array.control.add');
  const labelClass = getStyleAsClassName('array.control.label');
  const childControlsClass = getStyleAsClassName('array.child.controls');
  const buttonClassUp = getStyleAsClassName('array.child.controls.up');
  const buttonClassDown = getStyleAsClassName('array.child.controls.down');
  const buttonClassDelete = getStyleAsClassName('array.child.controls.delete');
  const controlClass = [
    getStyleAsClassName('array.control'),
    convertToValidClassName(controlElement.scope),
  ].join(' ');

  return (
    <div className={controlClass}>
      <header>
        <label className={labelClass}>{label}</label>
        <button
          className={buttonClassAdd}
          onClick={addItem(path, createDefaultValue(schema))}
        >
          Add to {label}
        </button>
      </header>
      <div className={divClassNames}>{errors}</div>
      <div className={classNames.children}>
        {data ? (
          range(0, data.length).map((index) => {
            const childPath = composePaths(path, `${index}`);
            return (
              <div key={index}>
                <JsonFormsDispatch
                  schema={schema}
                  uischema={childUiSchema || uischema}
                  path={childPath}
                  key={childPath}
                  renderers={renderers}
                />
                <div className={childControlsClass}>
                  <button
                    className={buttonClassUp}
                    aria-label={translations.upAriaLabel}
                    onClick={() => {
                      moveUp(path, index)();
                    }}
                  >
                    {translations.up}
                  </button>
                  <button
                    className={buttonClassDown}
                    aria-label={translations.downAriaLabel}
                    onClick={() => {
                      moveDown(path, index)();
                    }}
                  >
                    {translations.down}
                  </button>
                  <button
                    className={buttonClassDelete}
                    aria-label={translations.removeAriaLabel}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you wish to delete this item?'
                        )
                      ) {
                        removeItems(path, [index])();
                      }
                    }}
                  >
                    {translations.removeTooltip}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>{translations.noDataMessage}</p>
        )}
      </div>
    </div>
  );
};

export const ArrayControlRenderer = ({
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
  moveUp,
  moveDown,
  id,
  visible,
  enabled,
  errors,
  translations,
}: ArrayControlProps & VanillaRendererProps) => {
  const controlElement = uischema as ControlElement;
  const labelDescription = Helpers.createLabelDescriptionFrom(
    controlElement,
    schema
  );
  const label = labelDescription.show ? labelDescription.text : '';
  const controlClassName = `control ${Helpers.convertToValidClassName(
    controlElement.scope
  )}`;
  const fieldSetClassName = getStyleAsClassName('array.layout');
  const buttonClassName = getStyleAsClassName('array.button');
  const childrenClassName = getStyleAsClassName('array.children');
  const classNames: { [className: string]: string } = {
    wrapper: controlClassName,
    fieldSet: fieldSetClassName,
    button: buttonClassName,
    children: childrenClassName,
  };

  return (
    <ArrayControl
      classNames={classNames}
      data={data}
      label={label}
      path={path}
      schema={schema}
      errors={errors}
      addItem={addItem}
      removeItems={removeItems}
      moveUp={moveUp}
      moveDown={moveDown}
      uischema={uischema}
      uischemas={uischemas}
      getStyleAsClassName={getStyleAsClassName}
      rootSchema={rootSchema}
      id={id}
      visible={visible}
      enabled={enabled}
      getStyle={getStyle}
      translations={translations}
    />
  );
};

export default withVanillaControlProps(
  withJsonFormsArrayControlProps(ArrayControlRenderer)
);
