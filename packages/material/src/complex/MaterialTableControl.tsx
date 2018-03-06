import * as React from 'react';
import * as _ from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import {
    ControlElement,
    Paths
} from '@jsonforms/core';
import { DispatchField } from '@jsonforms/react';
import { ValidationIcon } from './ValidationIcon';

const generateCells = (Cell, scopedSchema, rowPath, cellErrors?) =>
  Object.keys(scopedSchema.properties)
    .filter(prop => scopedSchema.properties[prop].type !== 'array')
    .map(prop => {
      const cellPath = Paths.compose(rowPath, prop);
      const props = {
        cellProperty: prop,
        scopedSchema,
        rowPath,
        cellPath,
        errors: cellErrors
      };

      return <Cell key={cellPath} {...props}/>;
    });

const EmptyTable = () => (
  <TableRow>
    <TableCell>No data</TableCell>
  </TableRow>
);

const TableHeaderCell = ({cellProperty}) =>
  <TableCell >{_.capitalize(cellProperty)}</TableCell>;

const TableContentCell = ({rowPath, cellProperty, cellPath, errors, scopedSchema}) => {
  const cellErrors = errors
    .filter(error => error.dataPath === cellPath)
    .map(error => error.message);
  const createControlElement = (key: string): ControlElement => ({
    type: 'Control',
    label: false,
    scope: `#/properties/${key}`
  });

  return (
    <TableCell>
      <Grid container alignItems='center' justify='center' spacing={0}>
        <Grid item xs={1} hidden={{smUp: cellErrors.length === 0}}>
          <ValidationIcon id={`tooltip-${cellPath}`} errorMessages={cellErrors}/>
        </Grid>
        <Grid item xs>
          <DispatchField
            schema={scopedSchema}
            uischema={createControlElement(cellProperty)}
            path={rowPath}
          />
        </Grid>
      </Grid>
    </TableCell>
  );
};

const TableWithContent = tableProps => {
  const {data, path, scopedSchema, childErrors, select, isSelected} = tableProps;

  return data.map((_child, index) => {
    const childPath = Paths.compose(path, `${index}`);
    const selected = isSelected(index);

    return (
      <TableRow
        key={childPath}
        hover
        selected={selected}
      >
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onChange={e => select(e, index)}/>
        </TableCell>
        {generateCells(TableContentCell, scopedSchema, childPath, childErrors)}
      </TableRow>
    );
  });
};

export const MaterialTableControl = props =>  {
    const { data, path, scopedSchema, numSelected, selectAll } = props;
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
              {generateCells(TableHeaderCell, scopedSchema, path)}
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmptyTable ? <EmptyTable/> : <TableWithContent {...props}/>}
          </TableBody>
        </Table>
    );
};
