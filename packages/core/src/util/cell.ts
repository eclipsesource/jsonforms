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
import {
  getErrorTranslator,
  getAjv,
  getConfig,
  getData,
  getErrorAt,
  getSchema,
  getTranslator,
} from '../reducers';
import type { JsonFormsCellRendererRegistryEntry } from '../reducers';
import type { AnyAction, Dispatch } from './type';
import { Resolve } from './util';
import { isInherentlyEnabled, isVisible } from './runtime';
import {
  DispatchPropsOfControl,
  EnumOption,
  enumToEnumOptionMapper,
  mapDispatchToControlProps,
  oneOfToEnumOptionMapper,
  OwnPropsOfControl,
  OwnPropsOfEnum,
  StatePropsOfScopedRenderer,
} from './renderer';
import { getCombinedErrorMessage, getI18nKeyPrefix } from '../i18n';
import type { JsonFormsState } from '../store';
import type { JsonSchema } from '../models';

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
  const { id, schema, path, uischema, renderers, cells } = ownProps;
  const rootData = getData(state);
  const visible =
    ownProps.visible !== undefined
      ? ownProps.visible
      : isVisible(uischema, rootData, undefined, getAjv(state));

  const rootSchema = getSchema(state);
  const config = getConfig(state);

  /* When determining the enabled state of cells we take a shortcut: At the
   * moment it's only possible to configure enablement and disablement at the
   * control level. Therefore the renderer using the cell, for example a
   * table renderer, determines whether a cell is enabled and should hand
   * over the prop themselves. If that prop was given, we prefer it over
   * anything else to save evaluation effort (except for the global readonly
   * flag). For example it would be quite expensive to evaluate the same ui schema
   * rule again and again for each cell of a table. */
  let enabled;
  if (state.jsonforms.readonly === true) {
    enabled = false;
  } else if (typeof ownProps.enabled === 'boolean') {
    enabled = ownProps.enabled;
  } else {
    enabled = isInherentlyEnabled(
      state,
      ownProps,
      uischema,
      schema || rootSchema,
      rootData,
      config
    );
  }

  const t = getTranslator()(state);
  const te = getErrorTranslator()(state);
  const errors = getCombinedErrorMessage(
    getErrorAt(path, schema)(state),
    te,
    t,
    schema,
    uischema,
    path
  );
  const isValid = isEmpty(errors);

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
    rootSchema,
    renderers,
    cells,
  };
};

export const mapStateToDispatchCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfCell
): DispatchCellStateProps => {
  const props: StatePropsOfCell = mapStateToCellProps(state, ownProps);
  const { renderers: _renderers, cells, ...otherOwnProps } = ownProps;
  return {
    ...props,
    ...otherOwnProps,
    cells: cells || state.jsonforms.cells || [],
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
  const options: EnumOption[] =
    ownProps.options ||
    props.schema.enum?.map((e) =>
      enumToEnumOptionMapper(
        e,
        getTranslator()(state),
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      )
    ) ||
    (props.schema.const && [
      enumToEnumOptionMapper(
        props.schema.const,
        getTranslator()(state),
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      ),
    ]);
  return {
    ...props,
    options,
  };
};

/**
 * mapStateToOneOfEnumCellProps for one of enum cell. Options is used for populating dropdown list from oneOf
 * @param state
 * @param ownProps
 * @returns {StatePropsOfEnumCell}
 */
export const mapStateToOneOfEnumCellProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfEnumCell
): StatePropsOfEnumCell => {
  const props: StatePropsOfCell = mapStateToCellProps(state, ownProps);
  const options: EnumOption[] =
    ownProps.options ||
    (props.schema.oneOf as JsonSchema[])?.map((oneOfSubSchema) =>
      oneOfToEnumOptionMapper(
        oneOfSubSchema,
        getTranslator()(state),
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      )
    );
  return {
    ...props,
    options,
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
      handleChange: ownProps.handleChange || handleChange,
    };
  };
