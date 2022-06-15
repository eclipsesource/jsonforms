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
import React, { Fragment, useMemo } from 'react';
import {
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {
  ArrayLayoutProps,
  ControlElement,
  errorsAt,
  formatErrorMessage,
  JsonSchema,
  Paths,
  Resolve,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  encode
} from '@jsonforms/core';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

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
  enabled: boolean,
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  if (schema.type === 'object') {
    return getValidColumnProps(schema).map(prop => {
      const cellPath = Paths.compose(rowPath, prop);
      const props = {
        propName: prop,
        schema,
        title: schema.properties?.[prop]?.title ?? startCase(prop),
        rowPath,
        cellPath,
        enabled,
        cells
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
  if (scopedSchema.type === 'object' && typeof scopedSchema.properties === 'object') {
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
  title: string;
}

const TableHeaderCell = React.memo(({ title }: TableHeaderCellProps) => (
  <TableCell>{title}</TableCell>
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
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
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
      errorsAt(
        path,
        ownProps.schema,
        p => p === path
      )(ctx.core.errors).map((error: ErrorObject) => error.message)
    )
  );
  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: ctx.core.schema,
    errors,
    path,
    enabled: ownProps.enabled,
    cells: ownProps.cells || ctx.cells,
    renderers: ownProps.renderers || ctx.renderers
  };
};

const controlWithoutLabel = (scope: string): ControlElement => ({
  type: 'Control',
  scope: scope,
  label: false
});

interface NonEmptyCellComponentProps {
  path: string,
  propName?: string,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  errors: string,
  enabled: boolean,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[],
  isValid: boolean
}
const NonEmptyCellComponent = React.memo(({path, propName, schema, rootSchema, errors, enabled, renderers, cells, isValid}:NonEmptyCellComponentProps) => {
  return (
    <NoBorderTableCell>
      {schema.properties ? (
        <DispatchCell
          schema={Resolve.schema(
            schema,
            `#/properties/${encode(propName)}`,
            rootSchema
          )}
          uischema={controlWithoutLabel(`#/properties/${encode(propName)}`)}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      ) : (
        <DispatchCell
          schema={schema}
          uischema={controlWithoutLabel('#')}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      )}
      <FormHelperText error={!isValid}>{!isValid && errors}</FormHelperText>
    </NoBorderTableCell>
  );
});

const NonEmptyCell = (ownProps: OwnPropsOfNonEmptyCell) => {
  const ctx = useJsonForms();
  const emptyCellProps = ctxToNonEmptyCellProps(ctx, ownProps);

  const isValid = isEmpty(emptyCellProps.errors);
  return <NonEmptyCellComponent {...emptyCellProps} isValid={isValid}/>
};

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowIndex: number;
  moveUpCreator: (path:string, position: number)=> ()=> void;
  moveDownCreator: (path:string, position: number)=> ()=> void;
  enableUp: boolean;
  enableDown: boolean;
  showSortButtons: boolean;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  path: string;
}

const NonEmptyRowComponent = 
  ({
    childPath,
    schema,
    rowIndex,
    openDeleteDialog,
    moveUpCreator,
    moveDownCreator,
    enableUp,
    enableDown,
    showSortButtons,
    enabled,
    cells,
    path
  }: NonEmptyRowProps & WithDeleteDialogSupport) => {
    const moveUp = useMemo(() => moveUpCreator(path, rowIndex),[moveUpCreator, path, rowIndex]);
    const moveDown = useMemo(() => moveDownCreator(path, rowIndex),[moveDownCreator, path, rowIndex]);
    return (
      <TableRow key={childPath} hover>
        {generateCells(NonEmptyCell, schema, childPath, enabled, cells)}
        {enabled ? (
          <NoBorderTableCell
            style={showSortButtons ? styles.fixedCell : styles.fixedCellSmall}
          >
            <Grid
              container
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
            >
              {showSortButtons ? (
                <Fragment>
                  <Grid item>
                    <IconButton aria-label={`Move up`} onClick={moveUp} disabled={!enableUp} size='large'>
                      <ArrowUpward />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label={`Move down`}
                      onClick={moveDown}
                      disabled={!enableDown}
                      size='large'>
                      <ArrowDownward />
                    </IconButton>
                  </Grid>
                </Fragment>
              ) : null}
              <Grid item>
                <IconButton
                  aria-label={`Delete`}
                  onClick={() => openDeleteDialog(childPath, rowIndex)}
                  size='large'>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </NoBorderTableCell>
        ) : null}
      </TableRow>
    );
  };
export const NonEmptyRow = React.memo(NonEmptyRowComponent);
interface TableRowsProp {
  data: number;
  path: string;
  schema: JsonSchema;
  uischema: ControlElement;
  config?: any;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  moveUp?(path: string, toMove: number): () => void;
  moveDown?(path: string, toMove: number): () => void;
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
  enabled,
  cells
}: TableRowsProp & WithDeleteDialogSupport) => {
  const isEmptyTable = data === 0;

  if (isEmptyTable) {
    return <EmptyTable numColumns={getValidColumnProps(schema).length + 1} />;
  }

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <React.Fragment>
      {range(data).map((index: number) => {
        const childPath = Paths.compose(path, `${index}`);

        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowIndex={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
            moveUpCreator={moveUp}
            moveDownCreator={moveDown}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={appliedUiSchemaOptions.showSortButtons || appliedUiSchemaOptions.showArrayTableSortButtons}
            enabled={enabled}
            cells={cells}
            path={path}
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
      enabled,
      cells
    } = this.props;

    const controlElement = uischema as ControlElement;
    const isObjectSchema = schema.type === 'object';
    const headerCells: any = isObjectSchema
      ? generateCells(TableHeaderCell, schema, path, enabled, cells)
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
