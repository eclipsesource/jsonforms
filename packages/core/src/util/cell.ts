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
import { getConfig, getData, getErrorAt, getSchema } from '../reducers';
import {
  formatErrorMessage,
  isEnabled,
  isVisible,
  OwnPropsOfControl,
  OwnPropsOfEnum,
  Resolve,
  StatePropsOfScopedRenderer
} from '.';
import { DispatchPropsOfControl, mapDispatchToControlProps } from './renderer';
import { JsonFormsState } from '../store';
import { AnyAction, Dispatch } from 'redux';
import { JsonFormsCellRendererRegistryEntry } from '../reducers/cells';
import { JsonSchema } from '..';

export { JsonFormsCellRendererRegistryEntry };

export interface OwnPropsOfCell extends OwnPropsOfControl {
  data?: any;
}

/**
 * State props of a cell.
 */
export interface StatePropsOfCell extends StatePropsOfScopedRenderer {
  isValid: boolean;
  rootSchema: JsonSchema;
}

export interface OwnPropsOfEnumCell extends OwnPropsOfCell, OwnPropsOfEnum {}

/**
 * State props of a cell for enum cell
 */
export interface StatePropsOfEnumCell
  extends StatePropsOfCell,
    OwnPropsOfEnum {}

/**
 * Props of an enum cell.
 */
export interface EnumCellProps
  extends StatePropsOfEnumCell,
    DispatchPropsOfControl {}

export type DispatchPropsOfCell = DispatchPropsOfControl;

/**
 * Props of a cell.
 */
export interface CellProps extends StatePropsOfCell, DispatchPropsOfCell {}
/**
 * Registers the given cell renderer when a JSON Forms store is created.
 * @param {RankedTester} tester
 * @param cell the cell to be registered
 * @returns {any}
 */
export interface DispatchCellStateProps extends StatePropsOfCell {
  cells?: JsonFormsCellRendererRegistryEntry[];
}

/**
 * Map state to cell props.
 *
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfCell} state props of a cell
 */
export const mapStateToCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfCell
): StatePropsOfCell => {
  const { id, schema, path, uischema } = ownProps;
  const rootData = getData(state);
  const visible =
    ownProps.visible !== undefined
      ? ownProps.visible
      : isVisible(uischema, rootData);
  const enabled =
    ownProps.enabled !== undefined
      ? ownProps.enabled
      : isEnabled(uischema, rootData);
  const errors = formatErrorMessage(
    union(getErrorAt(path, schema)(state).map(error => error.message))
  );
  const isValid = isEmpty(errors);
  const rootSchema = getSchema(state);

  return {
    data: Resolve.data(rootData, path),
    visible,
    enabled,
    id,
    path,
    errors,
    isValid,
    schema,
    uischema,
    config: getConfig(state),
    rootSchema
  };
};

export const mapStateToDispatchCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfCell
): DispatchCellStateProps => {
  const props: StatePropsOfCell = mapStateToCellProps(state, ownProps);
  const { renderers, ...otherOwnProps } = ownProps;
  return {
    ...props,
    ...otherOwnProps,
    cells: state.jsonforms.cells || []
  };
};

export interface DispatchCellProps extends DispatchCellStateProps {}

/**
 * Default mapStateToCellProps for enum cell. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfEnumCell}
 */
export const defaultMapStateToEnumCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfEnumCell
): StatePropsOfEnumCell => {
  const props: StatePropsOfCell = mapStateToCellProps(state, ownProps);
  const options =
    ownProps.options !== undefined ? ownProps.options : props.schema.enum;
  return {
    ...props,
    options
  };
};

/**
 * Synonym for mapDispatchToControlProps.
 *
 * @type {(dispatch) => {handleChange(path, value): void}}
 */
export const mapDispatchToCellProps: (
  dispatch: Dispatch<AnyAction>
) => DispatchPropsOfControl = mapDispatchToControlProps;

/**
 * Default dispatch to control props which can be customized to set handleChange action
 *
 */
export const defaultMapDispatchToControlProps =
  // TODO: ownProps types
  (dispatch: Dispatch<AnyAction>, ownProps: any): DispatchPropsOfControl => {
    const { handleChange } = mapDispatchToCellProps(dispatch);

    return {
      handleChange: ownProps.handleChange || handleChange
    };
  };
