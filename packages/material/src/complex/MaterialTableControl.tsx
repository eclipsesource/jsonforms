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
import * as React from 'react';
import * as _ from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import { Grid, Hidden, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import {
    ArrayControlProps,
    ControlElement,
    JsonSchema,
    Paths
} from '@jsonforms/core';
import { DispatchField } from '@jsonforms/react';
import ValidationIcon from './ValidationIcon';
import { TableToolbar } from './TableToolbar';

const generateCells =
    (Cell: any, scopedSchema: JsonSchema, rowPath: string, cellErrors?: any[]) => {
        if (scopedSchema.type === 'object') {
            return getValidColumnProps(scopedSchema)
                .map(prop => {
                    const cellPath = Paths.compose(rowPath, prop);
                    const props = {
                        cellProperty: prop,
                        scopedSchema,
                        rowPath,
                        cellPath,
                        errors: cellErrors
                    };

                    return <Cell key={cellPath} {...props} />;
                });
        } else {
            /*primitives*/
            const cellPath = rowPath;
            const props = {
                scopedSchema,
                rowPath,
                cellPath,
                errors: cellErrors
            };

            return <Cell key={cellPath} {...props} />;
        }
    };

const generateHeaderCellForPrimitives = (toolbarProps: any) => {

    return (
        <TableCell>
            <TableToolbar {...toolbarProps} />
        </TableCell>
    );
};
const getValidColumnProps = (scopedSchema: JsonSchema) => {
    if (scopedSchema.type === 'object') {
        return Object.keys(scopedSchema.properties)
            .filter(prop => scopedSchema.properties[prop].type !== 'array');
    }
    /*primitives*/
    return [''];
};

export interface EmptyTableProps {
    numColumns: number;
}

const EmptyTable = ({ numColumns }: EmptyTableProps) => (
    <TableRow>
        <TableCell colSpan={numColumns}>
            <Typography align='center'>No data</Typography>
        </TableCell>
    </TableRow>
);

interface TableHeaderCellProps {
    cellProperty: string;
}

const TableHeaderCell = ({ cellProperty }: TableHeaderCellProps) =>
    <TableCell >{_.capitalize(cellProperty)}</TableCell>;

interface TableContentCellProps {
    rowPath: string;
    cellProperty: string;
    cellPath: string;
    errors: any[];
    scopedSchema: JsonSchema;
}

const TableContentCell =
    ({ rowPath, cellProperty, cellPath, errors, scopedSchema }: TableContentCellProps) => {
        const cellErrors = errors
            .filter(error => error.dataPath === cellPath)
            .map(error => error.message);
        const createControlElement = (key: string): ControlElement => ({
            type: 'Control',
            label: false,
            scope: scopedSchema.type === 'object' ? `#/properties/${key}` : '#'
        });

        return (
            <TableCell>
                <Grid container alignItems='center' justify='center' spacing={0}>
                    <Hidden smUp={cellErrors.length === 0}>
                        <Grid item xs={1}>
                            <ValidationIcon
                                id={`tooltip-${cellPath}`}
                                errorMessages={cellErrors}
                            />
                        </Grid>
                    </Hidden>
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

interface TableWithContentProps extends ArrayControlProps {
    isSelected(index: number): boolean;
    select(event: any, index: number): void;
}

const TableWithContent = (tableProps: TableWithContentProps) => {
    const { data, path, scopedSchema, childErrors, select, isSelected } = tableProps;

    return data.map((_child: any, index: number) => {
        const childPath = Paths.compose(path, `${index}`);
        const selected = isSelected(index);

        return (
            <TableRow
                key={childPath}
                hover
                selected={selected}
            >
                <TableCell padding='checkbox'>
                    <Checkbox checked={selected} onChange={e => select(e, index)} />
                </TableCell>
                {generateCells(TableContentCell, scopedSchema, childPath, childErrors)}
            </TableRow>
        );
    });
};

interface MaterialArrayControlProps extends ArrayControlProps {
    numSelected: number;
    selectAll(ev: any, checked: boolean): void;
}

export const MaterialTableControl = (props: MaterialArrayControlProps) => {
    const { data, path, scopedSchema, numSelected, selectAll } = props;
    const isEmptyTable = !data || !Array.isArray(data) || data.length === 0;
    const rowCount = data ? data.length : 0;
    const toolbarProps = { numSelected, ...props };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell padding='checkbox' style={{ width: '1em' }}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={!isEmptyTable && numSelected === rowCount}
                            onChange={selectAll}
                        />
                    </TableCell>
                    {scopedSchema.type === 'object' ?
                        generateCells(TableHeaderCell, scopedSchema, path) :
                        generateHeaderCellForPrimitives(toolbarProps)}
                </TableRow>
            </TableHead>
            <TableBody>
                {isEmptyTable ?
                    <EmptyTable numColumns={getValidColumnProps(scopedSchema).length + 1} /> :
                    <TableWithContent {...props} />}
            </TableBody>
        </Table>
    );
};
