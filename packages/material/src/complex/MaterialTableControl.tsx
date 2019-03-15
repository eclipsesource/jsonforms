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
import union from 'lodash/union';
import { DispatchField } from '@jsonforms/react';
import startCase from 'lodash/startCase';
import range from 'lodash/range';
import React from 'react';
import { connect } from 'react-redux';
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
  ArrayLayoutProps,
  ControlElement,
  formatErrorMessage,
  Generate,
  getErrorAt,
  JsonFormsState,
  JsonSchema,
  Paths,
  Resolve
} from '@jsonforms/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { WithDeleteDialogSupport } from './DeleteDialog';
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
  Cell: React.ComponentType<OwnPropsOfNonEmptyCell | TableHeaderCellProps>,
  schema: JsonSchema,
  rowPath: string
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
        cellPath
      };

      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      rowPath,
      cellPath: rowPath
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

const TableHeaderCell = React.memo(({ propName }: TableHeaderCellProps) => (
  <TableCell>{startCase(propName)}</TableCell>
));

interface NonEmptyCellProps extends OwnPropsOfNonEmptyCell {
  rootSchema: JsonSchema;
  errors: string;
  path: string;
}
interface OwnPropsOfNonEmptyCell {
  rowPath: string;
  propName?: string;
  schema: JsonSchema;
}
const mapStateToNonEmptyCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfNonEmptyCell
): NonEmptyCellProps => {

  const path = ownProps.rowPath + (ownProps.schema.type === 'object' ? '.' + ownProps.propName : '');
  const errors = formatErrorMessage(
    union(
      getErrorAt(path, ownProps.schema)(state).map(
        error => error.message
      )
    )
  );
  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: state.jsonforms.core.schema,
    errors,
    path
  };
};

class NonEmptyCellInner extends React.Component<NonEmptyCellProps, any> {
  render() {
    const { path, propName, schema, rootSchema, errors } = this.props;

    const isValid = isEmpty(errors);

    return (
      <NoBorderTableCell>
        {schema.properties ? (
          <DispatchField
            schema={Resolve.schema(
              schema,
              `#/properties/${propName}`,
              rootSchema
            )}
            uischema={Generate.controlElement(
              undefined,
              `#/properties/${propName}`
            )}
            path={path}
          />
        ) : (
          <DispatchField
            schema={schema}
            uischema={Generate.controlElement(undefined, '#')}
            path={path}
          />
        )}
        <FormHelperText error={!isValid}>{!isValid && errors}</FormHelperText>
      </NoBorderTableCell>
    );
  }
}
const NonEmptyCell = connect(mapStateToNonEmptyCellProps)(NonEmptyCellInner);

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowData: number;
}

const NonEmptyRow = React.memo(({
  childPath,
  schema,
  rowData,
  openDeleteDialog
}: NonEmptyRowProps & WithDeleteDialogSupport) => (
  <TableRow key={childPath} hover>
    {generateCells(NonEmptyCell, schema, childPath)}
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
));
interface TableRowsProp {
  data: number;
  path: string;
  schema: JsonSchema;
}
const TableRows = ({
  data,
  path,
  schema,
  openDeleteDialog
}: TableRowsProp & WithDeleteDialogSupport) => {
  const isEmptyTable = data === 0;

  if (isEmptyTable) {
    return <EmptyTable numColumns={getValidColumnProps(schema).length + 1} />;
  }

  return (
    <React.Fragment>
      {range(data).map((index: number) => {
        const childPath = Paths.compose(
          path,
          `${index}`
        );

        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowData={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
          />
        );
      })}
    </React.Fragment>
  );
};

export class MaterialTableControl extends React.Component<
ArrayLayoutProps & WithDeleteDialogSupport,
  any
> {
  addItem = (path: string, value: any) => this.props.addItem(path, value);
  render() {
    const {
      label,
      path,
      schema,
      rootSchema,
      uischema,
      errors,
      openDeleteDialog,
      visible
    } = this.props;

    const controlElement = uischema as ControlElement;
    const isObjectSchema = schema.type === 'object';
    const headerCells: any = isObjectSchema
      ? generateCells(TableHeaderCell, schema, path)
      : undefined;

    return (
      <Hidden xsUp={!visible}>
        <Table>
          <TableHead>
            <TableToolbar
              errors={errors}
              label={label}
              addItem={this.addItem}
              numColumns={isObjectSchema ? headerCells.length : 1}
              path={path}
              uischema={controlElement}
              schema={schema}
              rootSchema={rootSchema}
            />
            {isObjectSchema && (
              <TableRow>
                {headerCells}
                <TableCell />
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            <TableRows openDeleteDialog={openDeleteDialog} {...this.props} />
          </TableBody>
        </Table>
      </Hidden>
    );
  }
}
