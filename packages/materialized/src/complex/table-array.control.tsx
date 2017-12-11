import * as React from 'react';
import * as _ from 'lodash';
import {
  and,
  compose,
  ControlElement,
  ControlProps,
  convertToClassName,
  DispatchField,
  formatErrorMessage,
  getLabelObject,
  JsonForms,
  JsonSchema,
  mapStateToControlProps,
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

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';

/**
 * Tester for an array of objects.
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
    const labelObject = getLabelObject(controlElement);
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={controlClass} hidden={!visible}>
        <Toolbar>
          <Typography type='title' className={labelClass}>{label}</Typography>
          <Button raised color='primary' className={buttonClass}
            onClick={() => this.addNewItem(path)}>
            Add to {labelObject.text}
          </Button>
        </Toolbar>
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
        <Table className={tableClass}>
          <TableHead>
            <TableRow>
            {
              _(resolvedSchema.properties)
                .keys()
                .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                .map(prop => <TableCell key={prop}>{prop}</TableCell>)
                .value()
            }
            </TableRow>
          </TableHead>
          <TableBody>
          {
            (!data || !Array.isArray(data) || data.length === 0) ?
              <TableRow><TableCell>No data</TableCell></TableRow> : data.map((_child, index) => {
              const childPath = compose(path, index + '');

              return (
                <TableRow key={childPath}>
                  {
                    _.chain(resolvedSchema.properties)
                      .keys()
                      .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                      .map((prop, idx) => {
                        return (
                          <TableCell key={compose(childPath, idx.toString())}>
                            <DispatchField
                              schema={resolvedSchema}
                              uischema={createControlElement(prop)}
                              path={childPath}
                            />
                          </TableCell>
                        );
                      })
                      .value()
                  }
                </TableRow>
              );
            })
          }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default registerStartupRenderer(
  tableArrayTester,
  connect(mapStateToControlProps)(TableArrayControl)
);
