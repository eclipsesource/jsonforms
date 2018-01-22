import * as React from 'react';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import {
    ControlElement,
    DispatchField,
    Paths
} from '@jsonforms/core';
import { ValidationIcon } from './ValidationIcon';

export const MaterialTableControl = props =>  {
    const { data, path, resolvedSchema, numSelected, selectAll } = props;
    const isEmptyTable = !data || !Array.isArray(data) || data.length === 0;
    const rowCount = data ? data.length : 0;

    return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox' style={{width: '1em'}}>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={selectAll}
                />
              </TableCell>
              {generateCells(TableHeaderCell, resolvedSchema, path)}
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmptyTable ? <EmptyTable/> : <TableWithContent {...props}/>}
          </TableBody>
        </Table>
    );
};

const EmptyTable = () => (
    <TableRow>
      <TableCell>No data</TableCell>
    </TableRow>
);
const TableHeaderCell = ({cellProperty}) =>
  <TableCell >{cellProperty}</TableCell>;

const TableWithContent = tableProps => {
  const {data, path, resolvedSchema, childErrors, select, isSelected} = tableProps;

  return data.map((child, index) => {
    const childPath = Paths.compose(path, index + '');

    return (
      <TableRow
        key={childPath}
        hover
        selected={isSelected(child)}
      >
        <TableCell padding='checkbox'>
          <Checkbox checked={isSelected(child)} onChange={e => select(e, child)}/>
        </TableCell>
        {generateCells(TableContentCell, resolvedSchema, childPath, childErrors)}
      </TableRow>
    );
  });
};
const TableContentCell = ({rowPath, cellProperty, cellPath, errors, resolvedSchema}) => {
  const cellErrors = errors
                        .filter(error => error.dataPath === cellPath)
                        .map(error => error.message);
  const createControlElement = (key: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: { $ref: `#/properties/${key}` }
    });

  return (
    <TableCell>
      <Grid container alignItems='center' justify='center' spacing={0}>
        <Grid item xs={1} hidden={{smUp: cellErrors.length === 0}}>
          <ValidationIcon id={`tooltip-${cellPath}`} errorMessages={cellErrors}/>
        </Grid>
        <Grid item xs>
          <DispatchField
            schema={resolvedSchema}
            uischema={createControlElement(cellProperty)}
            path={rowPath}
          />
        </Grid>
      </Grid>
    </TableCell>
  );
};

const generateCells = (Cell, resolvedSchema, rowPath, cellErrors?) =>
  Object.keys(resolvedSchema.properties)
  .filter(prop => resolvedSchema.properties[prop].type !== 'array')
  .map(prop => {
    const cellPath = Paths.compose(rowPath, prop);
    const props = {
      cellProperty: prop,
      resolvedSchema,
      rowPath,
      cellPath,
      errors: cellErrors
    };

    return <Cell key={cellPath} {...props}/>;
  });
