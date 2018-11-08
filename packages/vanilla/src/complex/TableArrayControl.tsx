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
import * as _ from 'lodash';
import {
    ArrayControlProps,
    ControlElement,
    formatErrorMessage,
    Helpers,
    isPlainLabel,
    mapDispatchToArrayControlProps,
    mapStateToArrayControlProps,
    Paths,
    RankedTester,
    StatePropsOfControl,
    Test,
} from '@jsonforms/core';
import { DispatchField } from '@jsonforms/react';
import { addVanillaControlProps } from '../util';
import { connect } from 'react-redux';
import { VanillaRendererProps } from '../index';

const {
  createLabelDescriptionFrom,
  convertToValidClassName
} = Helpers;

const {
  or,
  isObjectArrayControl,
  isPrimitiveArrayControl,
  rankWith
} = Test;

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayControlTester: RankedTester = rankWith(
    3,
    or(isObjectArrayControl, isPrimitiveArrayControl)
);

class TableArrayControl extends React.Component<ArrayControlProps & VanillaRendererProps, any> {

  render() {
    const {
      addItem,
      uischema,
      scopedSchema,
      path,
      data,
      visible,
      errors,
      label,
      getStyleAsClassName,
      childErrors
    } = this.props;

    const controlElement = uischema as ControlElement;
    const tableClass = getStyleAsClassName('array.table.table');
    const labelClass = getStyleAsClassName('array.table.label');
    const buttonClass = getStyleAsClassName('array.table.button');
    const controlClass = [getStyleAsClassName('array.table'),
      convertToValidClassName(controlElement.scope)].join(' ');
    const createControlElement = (key?: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: scopedSchema.type === 'object' ? `#/properties/${key}` : '#'
    });
    const labelObject = createLabelDescriptionFrom(controlElement);
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');
    const labelText = isPlainLabel(label) ? label : label.default;

    return (
      <div className={controlClass} hidden={!visible}>
        <header>
          <label className={labelClass}>
            {labelText}
          </label>
          <button className={buttonClass} onClick={addItem(path)}>
            Add to {labelObject.text}
          </button>
        </header>
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
        <table className={tableClass}>
          <thead>
          <tr>
            {
              scopedSchema.properties ?
                _(scopedSchema.properties)
                  .keys()
                  .filter(prop => scopedSchema.properties[prop].type !== 'array')
                  .map(prop => <th key={prop}>{prop}</th>)
                  .value()
                : <th>Items</th>
            }
            <th>
              Valid
            </th>
          </tr>
          </thead>
          <tbody>
          {
            (!data || !Array.isArray(data) || data.length === 0) ?
              <tr><td>No data</td></tr> :
              data.map((_child, index) => {
                const childPath = Paths.compose(path, `${index}`);
                // TODO
                const errorsPerEntry: any[] = _.filter(
                  childErrors,
                  error => error.dataPath.startsWith(childPath)
                );

                return (
                  <tr key={childPath}>
                    {
                      scopedSchema.properties ?
                        _.chain(scopedSchema.properties)
                          .keys()
                          .filter(prop => scopedSchema.properties[prop].type !== 'array')
                          .map(prop => {
                            const childPropPath = Paths.compose(childPath, prop.toString());

                            return (
                              <td key={childPropPath}>
                                <DispatchField
                                    schema={scopedSchema}
                                    uischema={createControlElement(prop)}
                                    path={childPath}
                                    showError
                                />
                              </td>
                            );
                          })
                          .value() :
                        <td key={Paths.compose(childPath, index.toString())}>
                          <DispatchField
                            schema={scopedSchema}
                            uischema={createControlElement()}
                            path={childPath}
                            showError
                          />
                        </td>
                    }
                    <td>
                      {
                        errorsPerEntry ?
                          <span className={getStyleAsClassName('array.validation.error')}>
                            {_.join(errorsPerEntry.map(e => e.message), ' and ')}
                          </span> :
                          <span>OK</span>
                      }
                    </td>
                  </tr>
                );
              })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
    addVanillaControlProps<StatePropsOfControl>(mapStateToArrayControlProps),
    mapDispatchToArrayControlProps
)(TableArrayControl);
