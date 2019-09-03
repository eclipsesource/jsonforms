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
import isEmpty from 'lodash/isEmpty';
import union from 'lodash/union';
import {
  DispatchCell,
  JsonFormsStateContext,
  useJsonForms
} from '@jsonforms/react';
import startCase from 'lodash/startCase';
import range from 'lodash/range';
import React, { Fragment } from 'react';
import {
  FormHelperText,
  Grid,
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
  errorsAt,
  formatErrorMessage,
  JsonSchema,
  Paths,
  Resolve
} from '@jsonforms/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

import { WithDeleteDialogSupport } from './DeleteDialog';
import NoBorderTableCell from './NoBorderTableCell';
import TableToolbar from './TableToolbar';
import { ErrorObject } from 'ajv';
import merge from 'lodash/merge';

// we want a cell that doesn't automatically span
const styles = {
  fixedCell: {
    width: '150px',
    height: '50px',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  },
  fixedCellSmall: {
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
  rowPath: string,
  enabled: boolean
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
        enabled
      };

      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      rowPath,
      cellPath: rowPath,
      enabled
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
  enabled: boolean;
}
interface OwnPropsOfNonEmptyCell {
  rowPath: string;
  propName?: string;
  schema: JsonSchema;
  enabled: boolean;
}
const ctxToNonEmptyCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfNonEmptyCell
): NonEmptyCellProps => {
  const path =
    ownProps.rowPath +
    (ownProps.schema.type === 'object' ? '.' + ownProps.propName : '');
  const errors = formatErrorMessage(
    union(
      errorsAt(path, ownProps.schema, p => p === path)(ctx.core.errors).map(
        (error: ErrorObject) => error.message
      )
    )
  );
  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: ctx.core.schema,
    errors,
    path,
    enabled: ownProps.enabled
  };
};

const controlWithoutLabel = (scope: string): ControlElement => ({
  type: 'Control',
  scope: scope,
  label: false
});

const NonEmptyCell = (ownProps: OwnPropsOfNonEmptyCell) => {
  const ctx = useJsonForms();
  const {
    path,
    propName,
    schema,
    rootSchema,
    errors,
    enabled
  } = ctxToNonEmptyCellProps(ctx, ownProps);

  const isValid = isEmpty(errors);

  return (
    <NoBorderTableCell>
      {schema.properties ? (
        <DispatchCell
          schema={Resolve.schema(
            schema,
            `#/properties/${propName}`,
            rootSchema
          )}
          uischema={controlWithoutLabel(`#/properties/${propName}`)}
          path={path}
          enabled={enabled}
        />
      ) : (
        <DispatchCell
          schema={schema}
          uischema={controlWithoutLabel('#')}
          path={path}
          enabled={enabled}
        />
      )}
      <FormHelperText error={!isValid}>{!isValid && errors}</FormHelperText>
    </NoBorderTableCell>
  );
};

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowIndex: number;
  moveUp: () => void;
  moveDown: () => void;
  enableUp: boolean;
  enableDown: boolean;
  showSortButtons: boolean;
  enabled: boolean;
}

const NonEmptyRow = React.memo(
  ({
    childPath,
    schema,
    rowIndex,
    openDeleteDialog,
    moveUp,
    moveDown,
    enableUp,
    enableDown,
    showSortButtons,
    enabled
  }: NonEmptyRowProps & WithDeleteDialogSupport) => {
    return (
      <TableRow key={childPath} hover>
        {generateCells(NonEmptyCell, schema, childPath, enabled)}
        {enabled ? (
          <NoBorderTableCell
            style={showSortButtons ? styles.fixedCell : styles.fixedCellSmall}
          >
            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='center'
            >
              {showSortButtons ? (
                <Fragment>
                  <Grid item>
                    <IconButton
                      aria-label={`Move up`}
                      onClick={moveUp}
                      disabled={!enableUp}
                    >
                      <ArrowUpward />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label={`Move down`}
                      onClick={moveDown}
                      disabled={!enableDown}
                    >
                      <ArrowDownward />
                    </IconButton>
                  </Grid>
                </Fragment>
              ) : null}
              <Grid item>
                <IconButton
                  aria-label={`Delete`}
                  onClick={() => openDeleteDialog(childPath, rowIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </NoBorderTableCell>
        ) : null}
      </TableRow>
    );
  }
);
interface TableRowsProp {
  data: number;
  path: string;
  schema: JsonSchema;
  moveUp?(path: string, toMove: number): () => void;
  moveDown?(path: string, toMove: number): () => void;
  uischema: ControlElement;
  config?: any;
  enabled: boolean;
}
const TableRows = ({
  data,
  path,
  schema,
  openDeleteDialog,
  moveUp,
  moveDown,
  uischema,
  config,
  enabled
}: TableRowsProp & WithDeleteDialogSupport) => {
  const isEmptyTable = data === 0;

  if (isEmptyTable) {
    return <EmptyTable numColumns={getValidColumnProps(schema).length + 1} />;
  }

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

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
            rowIndex={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
            moveUp={moveUp(path, index)}
            moveDown={moveDown(path, index)}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={appliedUiSchemaOptions.showSortButtons}
            enabled={enabled}
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
      visible,
      enabled
    } = this.props;

    const controlElement = uischema as ControlElement;
    const isObjectSchema = schema.type === 'object';
    const headerCells: any = isObjectSchema
      ? generateCells(TableHeaderCell, schema, path, enabled)
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
              enabled={enabled}
            />
            {isObjectSchema && (
              <TableRow>
                {headerCells}
                {enabled ? <TableCell /> : null}
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
