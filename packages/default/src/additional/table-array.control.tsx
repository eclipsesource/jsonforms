import * as React from 'react';
import * as _ from 'lodash';
import {
  and,
  compose,
  ControlElement,
  ControlProps,
  convertToClassName,
  DispatchField,
  mapStateToControlProps,
  formatErrorMessage,
  getElementLabelObject,
  JsonForms,
  JsonSchema,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  Renderer,
  resolveSchema,
  schemaMatches,
  uiTypeIs,
  update
} from 'jsonforms-core';
import { connect } from 'react-redux';

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayTester: RankedTester = rankWith(10, and(
    uiTypeIs('Control'),
    schemaMatches(schema =>
        !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items) // we don't care about tuples
        && (schema.items as JsonSchema).type === 'object'
    ))
);

export class TableArrayControl extends Renderer<ControlProps, void> {

  // TODO duplicate code
  addNewItem(path: string) {
    const element = {};
    this.props.dispatch(
      update(
        path,
        array => {
          if (array === undefined || array === null) {
            return [element];
          }

          const clone = _.clone(array);
          clone.push(element);

          return clone;
        }
      )
    );
  }

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, schema, path, data, visible, errors, label } = this.props;
    const controlElement = uischema as ControlElement;

    const tableClass = JsonForms.stylingRegistry.getAsClassName('array-table.table');
    const labelClass = JsonForms.stylingRegistry.getAsClassName('array-table.label');
    const buttonClass = JsonForms.stylingRegistry.getAsClassName('array-table.button');
    const controlClass = [JsonForms.stylingRegistry.getAsClassName('array-table'),
      convertToClassName(controlElement.scope.$ref)].join(' ');

    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref + '/items');
    const createControlElement = (key: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: { $ref: `#/properties/${key}` }
    });
    const labelObject = getElementLabelObject(schema, controlElement);
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={controlClass} hidden={!visible}>
        <header>
          <label className={labelClass}>
            {label}
          </label>
          <button className={buttonClass} onClick={ () => this.addNewItem(path) }>
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
              <tr><td>No data</td></tr> : data.map((child, index) => {
              const childPath = compose(path, index + '');

              return (
                <tr key={childPath}>
                  {
                    _.chain(resolvedSchema.properties)
                      .keys()
                      .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                      .map((prop, idx) => {
                        return (
                          <td key={compose(childPath, idx.toString())}>
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
  connect(mapStateToControlProps)(TableArrayControl)
);
