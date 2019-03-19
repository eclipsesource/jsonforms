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
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import { DispatchField } from '@jsonforms/react';
import startCase from 'lodash/startCase';
import React from 'react';
import {
  FormHelperText,
  Hidden,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {
  ArrayControlProps,
  ControlElement,
  formatErrorMessage,
  Generate,
  Helpers,
  JsonSchema,
  Paths,
  Resolve
} from '@jsonforms/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { WithDeleteDialogSupport } from './DeleteDialog';
import { ErrorObject } from 'ajv';
import NoBorderTableCell from './NoBorderTableCell';
import TableToolbar from './TableToolbar';

// we want a cell that doesn't automatically span
const styles = {
  fixedCell: {
    width: '50px',
    height: '50px',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  }
};

const generateCells = (
  Cell: React.ComponentType<NonEmptyCellProps | TableHeaderCellProps>,
  rootSchema: JsonSchema,
  schema: JsonSchema,
  rowPath: string,
  cellErrors?: any[]
) => {

  if (schema.type === 'object') {
    return getValidColumnProps(schema).map(prop => {
      const cellPath = Paths.compose(
        rowPath,
        prop
      );
      const props = {
        propName: prop,
        schema,
        rowPath,
        cellPath,
        errors: cellErrors
      };

      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      rootSchema,
      rowPath,
      cellPath: rowPath,
      errors: cellErrors
    };
    return <Cell key={rowPath} {...props} />;
  }
};

const getValidColumnProps = (scopedSchema: JsonSchema) => {
  if (scopedSchema.type === 'object') {
    return Object.keys(scopedSchema.properties).filter(
      prop => scopedSchema.properties[prop].type !== 'array'
    );
  }
  // primitives
  return [''];
};

export interface EmptyTableProps {
  numColumns: number;
}

const EmptyTable = ({ numColumns }: EmptyTableProps) => (
  <TableRow>
    <NoBorderTableCell colSpan={numColumns}>
      <Typography align='center'>No data</Typography>
    </NoBorderTableCell>
  </TableRow>
);

interface TableHeaderCellProps {
  propName: string;
}

const TableHeaderCell = ({ propName }: TableHeaderCellProps) => (
  <TableCell>{startCase(propName)}</TableCell>
);

interface NonEmptyCellProps {
  rowPath: string;
  propName?: string;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  errors?: any[];
}

const NonEmptyCell = ({
  rowPath,
  propName,
  schema,
  rootSchema,
  errors
}: NonEmptyCellProps) => {
  const path = rowPath + (schema.type === 'object' ? '.' + propName : '');
  const errorsPerEntry: any[] = filter(
    errors,
    error => error.dataPath === path
  ).map(e => e.message);
  const isValid = isEmpty(errorsPerEntry);

  return (
    <React.Fragment>
      <NoBorderTableCell>
        {
          schema.properties ?
            <DispatchField
              schema={Resolve.schema(schema, `#/properties/${propName}`, rootSchema)}
              uischema={Generate.controlElement(
                undefined,
                `#/properties/${propName}`
              )}
              path={path}
            /> :
            <DispatchField
              schema={schema}
              uischema={Generate.controlElement(
                undefined,
                '#'
              )}
              path={path}
            />
        }
        <FormHelperText error={!isValid}>
          {!isValid && formatErrorMessage(errorsPerEntry)}
        </FormHelperText>
      </NoBorderTableCell>
    </React.Fragment>
  );
};

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  childErrors: ErrorObject[];
  rowData: any;
}

const NonEmptyRow = ({
  childPath,
  schema,
  rootSchema,
  childErrors,
  rowData,
  openDeleteDialog
}: NonEmptyRowProps & WithDeleteDialogSupport) => (
  <TableRow key={childPath} hover>
    {generateCells(NonEmptyCell, rootSchema, schema, childPath, childErrors)}
    <NoBorderTableCell style={styles.fixedCell}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton
          aria-label={`Delete`}
          onClick={() => openDeleteDialog(childPath, rowData)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </NoBorderTableCell>
  </TableRow>
);

const TableRows = (
  {
    data, path, rootSchema, schema, childErrors, openDeleteDialog
  }: ArrayControlProps & WithDeleteDialogSupport) => {

  const isEmptyTable = !data || !Array.isArray(data) || data.length === 0;

  if (isEmptyTable) {
    return (<EmptyTable numColumns={getValidColumnProps(schema).length + 1} />);
  }

  return data.map((_child: any, index: number) => {
    const childPath = Paths.compose(path, `${index}`);

    return (
      <NonEmptyRow
        key={childPath}
        childPath={childPath}
        rowData={_child}
        schema={schema}
        rootSchema={rootSchema}
        childErrors={childErrors}
        openDeleteDialog={openDeleteDialog}
      />
    );
  });
};

export class MaterialTableControl extends React.Component<
  ArrayControlProps & WithDeleteDialogSupport,
  any
> {
  render() {
    const {
      label,
      path,
      schema,
      rootSchema,
      uischema,
      childErrors,
      errors,
      createDefaultValue,
      addItem,
      openDeleteDialog,
      visible
    } = this.props;

    const controlElement = uischema as ControlElement;
    const labelObject = Helpers.createLabelDescriptionFrom(controlElement);
    const allErrors = [].concat(errors).concat(childErrors.map((e: ErrorObject) => e.message));
    const isObjectSchema = schema.type === 'object';
    const headerCells: any = isObjectSchema ?
      generateCells(TableHeaderCell, rootSchema, schema, path) : undefined;

    return (
      <Hidden xsUp={!visible}>
        <Table>
          <TableHead>
            <TableToolbar
              errors={allErrors}
              label={label}
              labelObject={labelObject}
              addItem={addItem}
              numColumns={isObjectSchema ? headerCells.length : 1}
              path={path}
              uischema={controlElement}
              schema={schema}
              rootSchema={rootSchema}
              createDefaultValue={createDefaultValue}
            />
            {
              isObjectSchema &&
              <TableRow>
                  {headerCells}
                  <TableCell/>
              </TableRow>
            }
          </TableHead>
          <TableBody>
            <TableRows
              {...this.props}
              openDeleteDialog={openDeleteDialog}
            />
          </TableBody>
        </Table>
      </Hidden>
    );
  }
}
