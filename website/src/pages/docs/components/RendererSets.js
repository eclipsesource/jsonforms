import React from 'react';
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import styles from '../../../styles/global.module.css'

const Supported = () => (
  <TableCell className={styles.renderer_sets__table__supported} />
)

const NotSupported = () => (
  <TableCell className={styles.renderer_sets__table__not_supported} />
)

export const RendererSetSchemaFeatureTable = () => (
  <div className={styles.renderer_sets__features_table}>
    <h2>JSON Schema Features</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>JSON Schema</TableCell>
          <TableCell>Renderer</TableCell>
          <TableCell>React Material</TableCell>
          <TableCell>Angular Material</TableCell>
          <TableCell>Ionic</TableCell>
          <TableCell>React Vanilla</TableCell>
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
          <NotSupported />
          <Supported />
          <Supported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>integer</TableCell>
          <TableCell>Number</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>Text</TableCell>
          <NotSupported />
          <Supported />
          <Supported />
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
          <NotSupported />
          <Supported />
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
        </TableRow>
        <TableRow>
          <TableCell>Time format</TableCell>
          <TableCell>Time field</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Datetime format</TableCell>
          <TableCell>Datetime field</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Object</TableCell>
          <TableCell>Vertical grid</TableCell>
          <Supported />
          <Supported />
          <Supported />
          <NotSupported />
        </TableRow>
        <TableRow>
          <TableCell>Array of primitives</TableCell>
          <TableCell>List</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell>Array of objects</TableCell>
          <TableCell>Table</TableCell>
          <Supported />
          <NotSupported />
          <NotSupported />
          <Supported />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>List with Detail</TableCell>
          <Supported />
          <Supported />
          <Supported />
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
  <div className={styles.renderer_sets__features_table}>
    <h2>UI Schema Features</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>UI Schema</TableCell>
          <TableCell>Renderer</TableCell>
          <TableCell>React Material</TableCell>
          <TableCell>Angular Material</TableCell>
          <TableCell>Ionic</TableCell>
          <TableCell>React Vanilla</TableCell>
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
          <Supported />
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