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
import fpfilter from 'lodash/fp/filter';
import fpmap from 'lodash/fp/map';
import fpflow from 'lodash/fp/flow';
import filter from 'lodash/filter';
import join from 'lodash/join';
import fpkeys from 'lodash/fp/keys';
import fpstartCase from 'lodash/fp/startCase';
import {
  ArrayControlProps,
  ControlElement,
  createDefaultValue,
  Helpers,
  Paths,
  RankedTester,
  Resolve,
  Test,
  getControlPath,
  encode,
} from '@jsonforms/core';
import { DispatchCell, withJsonFormsArrayControlProps } from '@jsonforms/react';
import { withVanillaControlProps } from '../util';
import type { VanillaRendererProps } from '../index';

const { convertToValidClassName } = Helpers;

const { or, isObjectArrayControl, isPrimitiveArrayControl, rankWith } = Test;

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
);

class TableArrayControl extends React.Component<
  ArrayControlProps & VanillaRendererProps,
  any
> {
  confirmDelete = (path: string, index: number) => {
    const p = path.substring(0, path.lastIndexOf('.'));
    this.props.removeItems(p, [index])();
  };

  render() {
    const {
      addItem,
      uischema,
      schema,
      rootSchema,
      path,
      data,
      visible,
      errors,
      label,
      getStyleAsClassName,
      childErrors,
      translations,
    } = this.props;

    const controlElement = uischema as ControlElement;
    const tableClass = getStyleAsClassName('array.table.table');
    const labelClass = getStyleAsClassName('array.table.label');
    const buttonClass = getStyleAsClassName('array.table.button');
    const validationClass = getStyleAsClassName('array.table.validation');
    const controlClass = [
      getStyleAsClassName('array.table'),
      convertToValidClassName(controlElement.scope),
    ].join(' ');
    const createControlElement = (key?: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: schema.type === 'object' ? `#/properties/${key}` : '#',
    });
    const isValid = errors.length === 0;
    const divClassNames = [validationClass]
      .concat(
        isValid ? '' : getStyleAsClassName('array.table.validation.error')
      )
      .join(' ');

    return (
      <div className={controlClass} hidden={!visible}>
        <header>
          <label className={labelClass}>{label}</label>
          <button
            className={buttonClass}
            onClick={addItem(path, createDefaultValue(schema))}
          >
            {translations.addTooltip}
          </button>
        </header>
        <div className={divClassNames}>{!isValid ? errors : ''}</div>
        <table className={tableClass}>
          <thead>
            <tr>
              {schema.properties ? (
                fpflow(
                  fpkeys,
                  fpfilter((prop) => schema.properties[prop].type !== 'array'),
                  fpmap((prop) => (
                    <th key={prop}>
                      {schema.properties[prop].title ?? fpstartCase(prop)}
                    </th>
                  ))
                )(schema.properties)
              ) : (
                <th>Items</th>
              )}
              <th>Valid</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {!data || !Array.isArray(data) || data.length === 0 ? (
              <tr>
                <td>{translations.noDataMessage}</td>
              </tr>
            ) : (
              data.map((_child, index) => {
                const childPath = Paths.compose(path, `${index}`);
                // TODO
                const errorsPerEntry: any[] = filter(childErrors, (error) => {
                  const errorPath = getControlPath(error);
                  return errorPath.startsWith(childPath);
                });

                const validationClassName =
                  getStyleAsClassName('array.validation');
                const errorValidationClassName = getStyleAsClassName(
                  'array.validation.error'
                );
                const errorClassNames = errorsPerEntry
                  ? [validationClassName]
                      .concat(errorValidationClassName)
                      .join(' ')
                  : validationClassName;

                return (
                  <tr key={childPath}>
                    {schema.properties ? (
                      fpflow(
                        fpkeys,
                        fpfilter(
                          (prop) => schema.properties[prop].type !== 'array'
                        ),
                        fpmap((prop) => {
                          const childPropPath = Paths.compose(
                            childPath,
                            prop.toString()
                          );
                          return (
                            <td key={childPropPath}>
                              <DispatchCell
                                schema={Resolve.schema(
                                  schema,
                                  `#/properties/${encode(prop)}`,
                                  rootSchema
                                )}
                                uischema={createControlElement(encode(prop))}
                                path={childPath + '.' + prop}
                              />
                            </td>
                          );
                        })
                      )(schema.properties)
                    ) : (
                      <td key={Paths.compose(childPath, index.toString())}>
                        <DispatchCell
                          schema={schema}
                          uischema={createControlElement()}
                          path={childPath}
                        />
                      </td>
                    )}
                    <td>
                      {errorsPerEntry ? (
                        <span className={errorClassNames}>
                          {join(
                            errorsPerEntry.map((e) => e.message),
                            ' and '
                          )}
                        </span>
                      ) : (
                        <span className={errorClassNames}>OK</span>
                      )}
                    </td>
                    <td>
                      <button
                        aria-label={translations.removeAriaLabel}
                        onClick={() => {
                          if (
                            window.confirm(translations.deleteDialogMessage)
                          ) {
                            this.confirmDelete(childPath, index);
                          }
                        }}
                      >
                        {translations.removeTooltip}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withVanillaControlProps(
  withJsonFormsArrayControlProps(TableArrayControl)
);
