import * as React from 'react';
import * as _ from 'lodash';
import {
  connectToJsonForms,
  ControlElement,
  ControlProps,
  DispatchField,
  formatErrorMessage,
  Helpers,
  JsonSchema,
  mapDispatchToTableControlProps,
  mapStateToTableControlProps,
  Paths,
  RankedTester,
  registerStartupRenderer,
  Renderer,
  Test,
} from '@jsonforms/core';
import { addVanillaControlProps } from '../util';

const {
  createLabelDescriptionFrom,
  convertToValidClassName
} = Helpers;

const {
  isArrayObjectControl,
  rankWith
} = Test;

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayTester: RankedTester = rankWith(3, isArrayObjectControl);

export interface TableProps extends ControlProps {
  resolvedSchema: JsonSchema;
  addItem(path: string): () => void;
  removeItems(path: string, toDelete: any[]): () => void;
  getStyleAsClassName(style: string): string;
}

class TableArrayControl extends Renderer<TableProps, void> {

  render() {
    const {
      addItem,
      uischema,
      resolvedSchema,
      path,
      data,
      visible,
      errors,
      label,
      getStyleAsClassName,
    } = this.props;

    const controlElement = uischema as ControlElement;
    const tableClass = getStyleAsClassName('array-table.table');
    const labelClass = getStyleAsClassName('array-table.label');
    const buttonClass = getStyleAsClassName('array-table.button');
    const controlClass = [getStyleAsClassName('array-table'),
      convertToValidClassName(controlElement.scope)].join(' ');
    const createControlElement = (key: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: `#/properties/${key}`
    });
    const labelObject = createLabelDescriptionFrom(controlElement);
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={controlClass} hidden={!visible}>
        <header>
          <label className={labelClass}>
            {label}
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
              _(resolvedSchema.properties)
                .keys()
                .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                .map(prop => <th key={prop}>{prop}</th>)
                .value()
            }
          </tr>
          </thead>
          <tbody>
          {
            (!data || !Array.isArray(data) || data.length === 0) ?
              <tr><td>No data</td></tr> : data.map((_child, index) => {
              const childPath = Paths.compose(path, index + '');

              return (
                <tr key={childPath}>
                  {
                    _.chain(resolvedSchema.properties)
                      .keys()
                      .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                      .map((prop, idx) => {
                        return (
                          <td key={Paths.compose(childPath, idx.toString())}>
                            <DispatchField
                              schema={resolvedSchema}
                              uischema={createControlElement(prop)}
                              path={childPath}
                            />
                          </td>
                        );
                      })
                      .value()
                  }
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

export default registerStartupRenderer(
  tableArrayTester,
  connectToJsonForms(
    addVanillaControlProps(mapStateToTableControlProps),
    mapDispatchToTableControlProps
  )(TableArrayControl)
);
