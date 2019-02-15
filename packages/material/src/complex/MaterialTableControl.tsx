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
import capitalize from 'lodash/capitalize';
import React from 'react';
import {
  FormHelperText,
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
  Paths
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
  scopedSchema: JsonSchema,
  rowPath: string,
  cellErrors?: any[]
) => {

  if (scopedSchema.type === 'object') {
    return getValidColumnProps(scopedSchema).map(prop => {
      const cellPath = Paths.compose(
        rowPath,
        prop
      );
      const props = {
        propName: prop,
        scopedSchema,
        rowPath,
        cellPath,
        errors: cellErrors
      };

      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      scopedSchema,
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
  <TableCell>{capitalize(propName)}</TableCell>
);

interface NonEmptyCellProps {
  rowPath: string;
  propName?: string;
  scopedSchema: JsonSchema;
  errors?: any[];
}

const NonEmptyCell = ({
  rowPath,
  propName,
  scopedSchema,
  errors
}: NonEmptyCellProps) => {
  const path = rowPath + (scopedSchema.type === 'object' ? '.' + propName : '');
  const errorsPerEntry: any[] = filter(
    errors,
    error => error.dataPath === path
  ).map(e => e.message);
  const isValid = isEmpty(errorsPerEntry);
  return (
    <React.Fragment>
      <NoBorderTableCell>
        <DispatchField
          schema={scopedSchema}
          uischema={Generate.controlElement(
            undefined,
            scopedSchema.type === 'object' ? `#/properties/${propName}` : '#'
          )}
          path={path}
        />
        <FormHelperText error={!isValid}>
          {!isValid && formatErrorMessage(errorsPerEntry)}
        </FormHelperText>
      </NoBorderTableCell>
    </React.Fragment>
  );
};

interface NonEmptyRowProps {
  childPath: string;
  scopedSchema: JsonSchema;
  childErrors: ErrorObject[];
  rowData: any;
}

const NonEmptyRow = ({
  childPath,
  scopedSchema,
  childErrors,
  rowData,
  openDeleteDialog
}: NonEmptyRowProps & WithDeleteDialogSupport) => (
  <TableRow key={childPath} hover>
    {generateCells(NonEmptyCell, scopedSchema, childPath, childErrors)}
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
    data, path, schema, childErrors, openDeleteDialog
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
        scopedSchema={schema}
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
      openDeleteDialog
    } = this.props;
    const controlElement = uischema as ControlElement;
    const labelObject = Helpers.createLabelDescriptionFrom(controlElement);
    const allErrors = [].concat(errors).concat(childErrors.map((e: ErrorObject) => e.message));
    const isObjectSchema = schema.type === 'object';
    const headerCells: any = isObjectSchema ?
      generateCells(TableHeaderCell, schema, path) : undefined;

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}
