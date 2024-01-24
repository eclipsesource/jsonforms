import React from 'react';
import TableCell from '@mui/material/TableCell/TableCell';
import TableHead from '@mui/material/TableHead/TableHead';
import Table from '@mui/material/Table/Table';
import TableBody from '@mui/material/TableBody/TableBody';
import TableRow from '@mui/material/TableRow/TableRow';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Supported = () => (
  <TableCell style = {{ textAlign: 'center' }} >
    <CheckIcon style = {{ color: '#187d0f' }}/>
  </TableCell>
);

const NotSupported = () => (
  <TableCell style = {{  textAlign: 'center' }} >
    <CloseIcon style = {{ color: '#d40d0d' }} />
  </TableCell>
);

export const RendererSetSchemaFeatureTable = () => (
  <div>
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
          <TableCell>Vue Vuetify</TableCell>
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Toggle</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>integer</TableCell>
          <TableCell>Number</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
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
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>String</TableCell>
          <TableCell>Text</TableCell>
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Enum</TableCell>
          <TableCell>Combo</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>oneOf (const / title)</TableCell>
          <TableCell>Combo</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Autocomplete</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Date format</TableCell>
          <TableCell>Date field</TableCell>
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Datetime format</TableCell>
          <TableCell>Datetime field</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Array of primitives</TableCell>
          <TableCell>List</TableCell>
          <Supported />
          <NotSupported />
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>List</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <Supported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>List with Detail</TableCell>
          <Supported />
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Array of enums</TableCell>
          <TableCell>Multiple Choice</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>oneOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>allOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>anyOf</TableCell>
          <TableCell>Tabs</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export const RendererSetUISchemaFeatureTable = () => (
  <div>
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
          <TableCell>Vue Vuetify</TableCell>
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Horizontal Layout</TableCell>
          <TableCell>Horizontal Grid</TableCell>
          <Supported />
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
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Group</TableCell>
          <TableCell>Group</TableCell>
          <Supported />
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
          <Supported />
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
