import React from 'react';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableSupported: {
    backgroundColor: '#7da01f',
    opacity: 0.5
  },
  tableNotSupported: {
    opacity: 0.5
  },
  featureTable: {
    ['@media only screen and (max-width: 850px)']: {
      display: 'none'
    },
  }
});

const Supported = () => (
  <TableCell className={useStyles().tableSupported} />
);

const NotSupported = () => (
  <TableCell className={useStyles().tableNotSupported} />
);

export const RendererSetSchemaFeatureTable = () => (
  <div className={useStyles().featureTable}>
    <h2>JSON Schema Features</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>JSON Schema</TableCell>
          <TableCell>Renderer</TableCell>
          <TableCell>React Material</TableCell>
          <TableCell>Angular Material</TableCell>
          <TableCell>React Vanilla</TableCell>
          <TableCell>Vue Vanilla</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>boolean</TableCell>
          <TableCell>Checkbox</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Toggle</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>integer</TableCell>
          <TableCell>Number</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Text</TableCell>
          <NotSupported />
          <Supported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>String</TableCell>
          <TableCell>Text</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Textarea</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Enum</TableCell>
          <TableCell>Combo</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Autocomplete</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>oneOf (const / title)</TableCell>
          <TableCell>Combo</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Autocomplete</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>Date format</TableCell>
          <TableCell>Date field</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Time format</TableCell>
          <TableCell>Time field</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Datetime format</TableCell>
          <TableCell>Datetime field</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Object</TableCell>
          <TableCell>Vertical grid</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>Array of primitives</TableCell>
          <TableCell>List</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Array of objects</TableCell>
          <TableCell>Table</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>List</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>List with Detail</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>Array of enums</TableCell>
          <TableCell>Multiple Choice</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>oneOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>allOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>anyOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export const RendererSetUISchemaFeatureTable = () => (
  <div className={useStyles().featureTable}>
    <h2>UI Schema Features</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>UI Schema</TableCell>
          <TableCell>Renderer</TableCell>
          <TableCell>React Material</TableCell>
          <TableCell>Angular Material</TableCell>
          <TableCell>React Vanilla</TableCell>
          <TableCell>Vue Vanilla</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Vertical Layout</TableCell>
          <TableCell>Vertical Grid</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Horizontal Layout</TableCell>
          <TableCell>Horizontal Grid</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Categorization</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>Group</TableCell>
          <TableCell>Group</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Label</TableCell>
          <TableCell>Text</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <Supported />
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
