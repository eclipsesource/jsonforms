import * as React from 'react';
import * as _ from 'lodash';
import { ErrorObject } from 'ajv';
import {
  and,
  ControlElement,
  ControlProps,
  DispatchField,
  getValidation,
  Helpers,
  JsonForms,
  JsonSchema,
  mapStateToControlProps,
  Paths,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  Renderer,
  resolveSchema,
  schemaMatches,
  uiTypeIs,
  update,
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Badge from 'material-ui/Badge';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import ErrorOutlineIcon from 'material-ui-icons/ErrorOutline';
import Tooltip from 'material-ui/Tooltip';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

/**
 * Tester for an array of objects.
 * @type {RankedTester}
 */
export const tableArrayTester: RankedTester = rankWith(10, and(
    uiTypeIs('Control'),
    schemaMatches(schema =>
        !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items) // we don't care about tuples
        && (schema.items as JsonSchema).type === 'object'
    ))
);
export interface TableState {
  selected: any[];
  openConfirmDelete: boolean;
}
export class TableArrayControl extends Renderer<TableProps, TableState> {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      openConfirmDelete: false
    };
  }

  render() {
    const { uischema, schema, path, data, visible, childErrors } = this.props;
    const controlElement = uischema as ControlElement;
    const tableClass = JsonForms.stylingRegistry.getAsClassName('array-table.table');
    const controlClass = [JsonForms.stylingRegistry.getAsClassName('array-table'),
    Helpers.convertToValidClassName(controlElement.scope.$ref)].join(' ');

    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref + '/items');

    const handleSelectAllClick = (_event, checked) => {
      if (checked) {
        this.setState({ selected: data });

        return;
      }
      this.setState({ selected: [] });
    };

    const handleClick = (_event, child) => {
      const selected = this.state.selected.filter(s => data.indexOf(s) !== -1);
      const selectedIndex = selected.indexOf(child);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, child);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      this.setState({ selected: newSelected });
    };

    const isSelected = child => this.state.selected.indexOf(child) !== -1;
    const handleOpenConfirmDelete = () => {
      this.setState({ openConfirmDelete: true });
    };

    const handleClose = () => {
      this.setState({ openConfirmDelete: false });
    };

    const isEmptyTable = !data || !Array.isArray(data) || data.length === 0;
    const tableProps = {data, path, resolvedSchema, childErrors,
        isSelected, handleClick, handleOpenConfirmDelete};
    const numSelected = this.state.selected.length;
    const rowCount = data.length;
    const toolbarProps = {
      errors: this.props.errors,
      childErrors,
      label: this.props.label,
      path,
      uischema,
      numSelected,
      handleOpenConfirmDelete,
      dispatch: this.props.dispatch
    };
    const removeItems = () => {
      this.props.dispatch(
        update(
          path,
          array => {
            const clone = _.clone(array);
            this.state.selected.forEach(s => clone.splice(clone.indexOf(s), 1));

            return clone;
          }
        )
      );
      this.setState({ selected: [] });
      handleClose();
    };

    return (
      <div className={controlClass} hidden={!visible}>
        <TableToolbar {...toolbarProps}/>
        <Table className={tableClass}>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox' style={{width: '1em'}}>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {generateCells(TableHeaderCell, resolvedSchema, path)}
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmptyTable ? <EmptyTable/> : <TableWithContent {...tableProps}/>}
          </TableBody>
        </Table>
        <Dialog
          open={this.state.openConfirmDelete}
          keepMounted
          onClose={handleClose}
          aria-labelledby='alert-dialog-confirmdelete-title'
          aria-describedby='alert-dialog-confirmdelete-description'
        >
          <DialogTitle id='alert-dialog-confirmdelete-title'>
            {'Confirm Deletion'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-confirmdelete-description'>
              Are you sure you want to delete the {this.state.selected.length} selected objects?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              No
            </Button>
            <Button onClick={removeItems} color='primary'>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export interface TableProps extends ControlProps {
  childErrors: ErrorObject[];
}
// FIXME copied from validation.ts
const errorAt = instancePath => (state): ErrorObject[] => {
  const path = instancePath + '.';

  return _.filter(state.errors, (error: ErrorObject) => error.dataPath.startsWith(path));
};
const mapStateToTableControlProps = (state, ownProps) => {
  const {data, errors, classNames, label, visible, enabled, id, path, inputs, required} =
    mapStateToControlProps(state, ownProps);

  const childErrors = errorAt(path)(getValidation(state));

  return {
    data,
    errors,
    classNames,
    label,
    visible,
    enabled,
    id,
    path,
    inputs,
    required,
    childErrors
  };
};
export default registerStartupRenderer(
  tableArrayTester,
  connect(mapStateToTableControlProps)(TableArrayControl)
);
const TableToolbar = ({errors, childErrors, label, path, uischema,
  numSelected, handleOpenConfirmDelete, dispatch}) => {
  const controlElement = uischema as ControlElement;
  const labelClass = JsonForms.stylingRegistry.getAsClassName('array-table.label');
  const buttonClass = JsonForms.stylingRegistry.getAsClassName('array-table.button');
  const labelObject = Helpers.createLabelDescriptionFrom(controlElement);
  const allErrors = [].concat(errors).concat(childErrors.map(e => e.message));

  // TODO duplicate code
  const addItem = () => {
    const element = {};
    dispatch(
      update(
        path,
        array => {
          if (array === undefined || array === null) {
            return [element];
          }

          const clone = _.clone(array);
          clone.push(element);

          return clone;
        }
      )
    );
  };

  return (
    <Toolbar hidden={true}>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <Typography type='title' className={labelClass}>{label}</Typography>
        </Grid>
        <Grid item hidden={{smUp: allErrors.length === 0}}>
          <ValidationIcon id='tooltip-validation' errorMessages={allErrors}/>
        </Grid>
        <Grid item>
          <Tooltip id='tooltip-add' title={`Add to ${labelObject.text}`} placement='bottom'>
            <Button
              fab
              color='primary'
              className={buttonClass}
              aria-label={`Add to ${labelObject.text}`}
              onClick={addItem}
            >
              <AddIcon/>
            </Button>
          </Tooltip>
          <Tooltip title='Delete'>
            <Button
              fab
              className={buttonClass}
              aria-label={`Delete`}
              disabled={numSelected === 0}
              onClick={handleOpenConfirmDelete}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Toolbar>
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

const ValidationIcon = ({id, errorMessages}) => (
  <Tooltip
    id={id}
    title={errorMessages.map((e, idx) => <div key={`${id}_${idx}`}>{e}</div>)}
  >
    <Badge badgeContent={errorMessages.length}>
      <ErrorOutlineIcon color='error'/>
    </Badge>
  </Tooltip>
);
const EmptyTable = () => (
  <TableRow>
    <TableCell>No data</TableCell>
  </TableRow>
);
const TableHeaderCell = ({cellProperty}) =>
  <TableCell >{cellProperty}</TableCell>;

const TableWithContent = tableProps => {
  const {data, path, resolvedSchema, childErrors,
    handleClick, isSelected} = tableProps;

  return data.map((child, index) => {
    const childPath = Paths.compose(path, index + '');

    return (
      <TableRow
        key={childPath}
        hover
        onClick={event => handleClick(event, child)}
        selected={isSelected(child)}
      >
        <TableCell padding='checkbox'>
          <Checkbox checked={isSelected(child)} />
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
      <Grid container alignItems='center' justify='center'>
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
