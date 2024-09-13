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

import get from 'lodash/get';
import {
  ControlElement,
  JsonSchema,
  LabelElement,
  UISchemaElement,
} from '../models';
import type { RankedTester } from '../testers';
import { CoreActions, update, UpdateArrayContext } from '../actions';
import type { ErrorObject } from 'ajv';
import type {
  AnyAction,
  Dispatch,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  JsonFormsUISchemaRegistryEntry,
} from '../store';
import {
  deriveLabelForUISchemaElement,
  getCombinedErrorMessage,
  getI18nKey,
  getI18nKeyPrefix,
  getI18nKeyPrefixBySchema,
  getTranslator,
  getErrorTranslator,
  ArrayTranslations,
} from '../i18n';
import cloneDeep from 'lodash/cloneDeep';
import {
  composePaths,
  composeWithUi,
  convertDateToString,
  createLabelDescriptionFrom,
  findUiControl,
  getFirstPrimitiveProp,
  getPropPath,
  hasShowRule,
  hasType,
  isEnumSchema,
  isLabelable,
  isOneOfEnumSchema,
  isVisible,
  Resolve,
  resolveSchema,
  decode,
} from '../util';
import {
  Translator,
  getAjv,
  getCells,
  getConfig,
  getData,
  getErrorAt,
  getRenderers,
  getSchema,
  getSubErrorsAt,
  getUISchemas,
  getUiSchema,
} from '../store';
import { isInherentlyEnabled } from './util';
import { CombinatorKeyword } from './combinators';
import { isEqual } from 'lodash';

const move = (array: any[], index: number, delta: number) => {
  const newIndex: number = index + delta;
  if (newIndex < 0 || newIndex >= array.length) {
    return;
  } // Already at the top or bottom.
  const indexes: number[] = [index, newIndex].sort((a, b) => a - b); // Sort the indixes
  array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
};

export const moveUp = (array: any[], toMove: number) => {
  move(array, toMove, -1);
};

export const moveDown = (array: any[], toMove: number) => {
  move(array, toMove, 1);
};

const isRequired = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema: JsonSchema
): boolean => {
  const pathSegments = schemaPath.split('/');
  const lastSegment = decode(pathSegments[pathSegments.length - 1]);
  // Skip "properties", "items" etc. to resolve the parent
  const nextHigherSchemaSegments = pathSegments.slice(
    0,
    pathSegments.length - 2
  );
  const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
  const nextHigherSchema = Resolve.schema(
    schema,
    nextHigherSchemaPath,
    rootSchema
  );

  return (
    nextHigherSchema !== undefined &&
    nextHigherSchema.required !== undefined &&
    nextHigherSchema.required.indexOf(lastSegment) !== -1
  );
};

/**
 * Adds an asterisk to the given label string based
 * on the required parameter.
 *
 * @param {string | undefined} label the label string
 * @param {boolean} required whether the label belongs to a control which is required
 * @param {boolean} hideRequiredAsterisk applied UI Schema option
 * @returns {string} the label string
 */
export const computeLabel = (
  label: string | undefined,
  required: boolean,
  hideRequiredAsterisk: boolean
): string => {
  return `${label ?? ''}${required && !hideRequiredAsterisk ? '*' : ''}`;
};

/**
 * Indicates whether to mark a field as required.
 *
 * @param {boolean} required whether the label belongs to a control which is required
 * @param {boolean} hideRequiredAsterisk applied UI Schema option
 * @returns {boolean} should the field be marked as required
 */
export const showAsRequired = (
  required: boolean,
  hideRequiredAsterisk: boolean
): boolean => {
  return required && !hideRequiredAsterisk;
};

/**
 * Create a default value based on the given schema.
 * @param schema the schema for which to create a default value.
 * @returns {any}
 */
export const createDefaultValue = (
  schema: JsonSchema,
  rootSchema: JsonSchema
) => {
  const resolvedSchema = Resolve.schema(schema, schema.$ref, rootSchema);
  if (resolvedSchema.default !== undefined) {
    return extractDefaults(resolvedSchema, rootSchema);
  }
  if (hasType(resolvedSchema, 'string')) {
    if (
      resolvedSchema.format === 'date-time' ||
      resolvedSchema.format === 'date' ||
      resolvedSchema.format === 'time'
    ) {
      return convertDateToString(new Date(), resolvedSchema.format);
    }
    return '';
  } else if (
    hasType(resolvedSchema, 'integer') ||
    hasType(resolvedSchema, 'number')
  ) {
    return 0;
  } else if (hasType(resolvedSchema, 'boolean')) {
    return false;
  } else if (hasType(resolvedSchema, 'array')) {
    return [];
  } else if (hasType(resolvedSchema, 'object')) {
    return extractDefaults(resolvedSchema, rootSchema);
  } else if (hasType(resolvedSchema, 'null')) {
    return null;
  } else {
    return {};
  }
};

/**
 * Returns the default value defined in the given schema.
 * @param schema the schema for which to create a default value.
 * @returns {any}
 */
export const extractDefaults = (schema: JsonSchema, rootSchema: JsonSchema) => {
  if (hasType(schema, 'object') && schema.default === undefined) {
    const result: { [key: string]: any } = {};
    for (const key in schema.properties) {
      const property = schema.properties[key];
      const resolvedProperty = property.$ref
        ? Resolve.schema(rootSchema, property.$ref, rootSchema)
        : property;
      if (resolvedProperty.default !== undefined) {
        result[key] = cloneDeep(resolvedProperty.default);
      }
    }
    return result;
  }
  return cloneDeep(schema.default);
};

/**
 * Whether an element's description should be hidden.
 *
 * @param visible whether an element is visible
 * @param description the element's description
 * @param isFocused whether the element is focused
 *
 * @returns {boolean} true, if the description is to be hidden, false otherwise
 */
export const isDescriptionHidden = (
  visible: boolean,
  description: string | undefined,
  isFocused: boolean,
  showUnfocusedDescription: boolean
): boolean => {
  return (
    description === undefined ||
    (description !== undefined && !visible) ||
    (!showUnfocusedDescription && !isFocused)
  );
};

export interface WithClassname {
  className?: string;
}

export interface EnumOption {
  label: string;
  value: any;
}

export const enumToEnumOptionMapper = (
  e: any,
  t?: Translator,
  i18nKey?: string
): EnumOption => {
  let label = typeof e === 'string' ? e : JSON.stringify(e);
  if (t) {
    if (i18nKey) {
      label = t(`${i18nKey}.${label}`, label);
    } else {
      label = t(label, label);
    }
  }
  return { label, value: e };
};

export const oneOfToEnumOptionMapper = (
  e: any,
  t?: Translator,
  fallbackI18nKey?: string
): EnumOption => {
  let label =
    e.title ??
    (typeof e.const === 'string' ? e.const : JSON.stringify(e.const));
  if (t) {
    // prefer schema keys as they can be more specialized
    if (e.i18n) {
      label = t(e.i18n, label);
    } else if (fallbackI18nKey) {
      label = t(`${fallbackI18nKey}.${label}`, label);
    } else {
      label = t(label, label);
    }
  }
  return {
    label,
    value: e.const,
  };
};

export interface OwnPropsOfRenderer {
  /**
   * The UI schema to be rendered.
   */
  uischema?: UISchemaElement;
  /**
   * The JSON schema that describes the data.
   */
  schema?: JsonSchema;
  /**
   * Whether the rendered element should be enabled.
   */
  enabled?: boolean;
  /**
   * Whether the rendered element should be visible.
   */
  visible?: boolean;

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;

  renderers?: JsonFormsRendererRegistryEntry[];

  cells?: JsonFormsCellRendererRegistryEntry[];

  uischemas?: JsonFormsUISchemaRegistryEntry[];
}

export interface OwnPropsOfControl extends OwnPropsOfRenderer {
  id?: string;
  // constraint type
  uischema?: ControlElement;
}

export interface OwnPropsOfLabel extends OwnPropsOfRenderer {
  uischema?: LabelElement;
}

export interface OwnPropsOfEnum {
  options?: EnumOption[];
}

export interface OwnPropsOfLayout extends OwnPropsOfRenderer {
  direction?: 'row' | 'column';
}

/**
 * State-based props of a {@link Renderer}.
 */
export interface StatePropsOfRenderer {
  /**
   * Any configuration options for the element.
   */
  config?: any;

  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  /**
   * The data to be rendered.
   */
  data?: any;

  /**
   * Whether the rendered element should be enabled.
   */
  enabled: boolean;
  /**
   * Whether the rendered element should be visible.
   */
  visible: boolean;

  /**
   * Instance path the data is written to, in case of a control.
   */
  path: string;

  /**
   * All available renderers.
   */
  renderers?: JsonFormsRendererRegistryEntry[];

  /**
   * All available cell renderers.
   */

  cells?: JsonFormsCellRendererRegistryEntry[];
}

/**
 * State-based properties for UI schema elements that have a scope.
 */
export interface StatePropsOfScopedRenderer extends StatePropsOfRenderer {
  // constraint type
  uischema: ControlElement;

  /**
   * Any validation errors that are caused by the data to be rendered.
   */
  errors: string;

  /**
   * The data to be rendered.
   */
  data: any;

  /**
   * The root schema as returned by the store.
   */
  rootSchema: JsonSchema;

  /**
   * A unique ID that should be used for rendering the scoped UI schema element.
   */
  id: string;
}

/**
 * Props of a {@link Renderer}.
 */
export interface RendererProps extends StatePropsOfRenderer {}

/**
 * State-based props of a Control
 */
export interface StatePropsOfControl extends StatePropsOfScopedRenderer {
  cells?: { tester: RankedTester; cell: any }[];

  /**
   * The label for the rendered element.
   */
  label: string;

  /**
   * Description of input cell
   */
  description?: string;

  /**
   * Whether the rendered data is required.
   */
  required?: boolean;

  i18nKeyPrefix?: string;

  // TODO: renderers?
}

/**
 * Dispatch-based props of a Control.
 */
export interface DispatchPropsOfControl {
  /**
   * Update handler that emits a data change
   *
   * @param {string} path the path to the data to be updated
   * @param {any} value the new value that should be written to the given path
   */
  handleChange(path: string, value: any): void;
}

/**
 * Props of a Control.
 */
export interface ControlProps
  extends StatePropsOfControl,
    DispatchPropsOfControl {}

/**
 * State props of a layout;
 */
export interface StatePropsOfLayout extends StatePropsOfRenderer {
  /**
   * Direction for the layout to flow
   */
  direction: 'row' | 'column';
  label?: string;
}

export interface LayoutProps extends StatePropsOfLayout {}

/**
 * The state of a control.
 */
export interface ControlState {
  /**
   * The current value.
   */
  value: any;

  /**
   * Whether the control is focused.
   */
  isFocused: boolean;
}

/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToControlProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfControl => {
  const { uischema } = ownProps;
  const rootData = getData(state);
  const path = composeWithUi(uischema, ownProps.path);
  const visible: boolean =
    ownProps.visible === undefined || hasShowRule(uischema)
      ? isVisible(uischema, rootData, ownProps.path, getAjv(state))
      : ownProps.visible;
  const controlElement = uischema as ControlElement;
  const id = ownProps.id;
  const rootSchema = getSchema(state);
  const required =
    controlElement.scope !== undefined &&
    isRequired(ownProps.schema, controlElement.scope, rootSchema);
  const resolvedSchema = Resolve.schema(
    ownProps.schema || rootSchema,
    controlElement.scope,
    rootSchema
  );
  const errors = getErrorAt(path, resolvedSchema)(state);

  const description =
    resolvedSchema !== undefined ? resolvedSchema.description : '';
  const data = Resolve.data(rootData, path);
  const labelDesc = createLabelDescriptionFrom(uischema, resolvedSchema);
  const label = labelDesc.show ? labelDesc.text : '';
  const config = getConfig(state);
  const enabled: boolean = isInherentlyEnabled(
    state,
    ownProps,
    uischema,
    resolvedSchema || rootSchema,
    rootData,
    config
  );

  const schema = resolvedSchema ?? rootSchema;
  const t = getTranslator()(state);
  const te = getErrorTranslator()(state);
  const i18nKeyPrefix = getI18nKeyPrefix(schema, uischema, path);
  const i18nLabel = t(getI18nKey(schema, uischema, path, 'label'), label, {
    schema,
    uischema,
    path,
    errors,
  });
  const i18nDescription = t(
    getI18nKey(schema, uischema, path, 'description'),
    description,
    { schema, uischema, path, errors }
  );
  const i18nErrorMessage = getCombinedErrorMessage(
    errors,
    te,
    t,
    schema,
    uischema,
    path
  );

  return {
    data,
    description: i18nDescription,
    errors: i18nErrorMessage,
    label: i18nLabel,
    visible,
    enabled,
    id,
    path,
    required,
    uischema,
    schema,
    config: getConfig(state),
    cells: ownProps.cells || state.jsonforms.cells,
    rootSchema,
    i18nKeyPrefix,
  };
};

/**
 *
 * Map dispatch to control props.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfControl} dispatch props for a control
 */
export const mapDispatchToControlProps = (
  dispatch: Dispatch<AnyAction>
): DispatchPropsOfControl => ({
  handleChange(path, value) {
    dispatch(update(path, () => value));
  },
});

/**
 * Default mapStateToCellProps for enum control. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
export const mapStateToEnumControlProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl & OwnPropsOfEnum
): StatePropsOfControl & OwnPropsOfEnum => {
  const props: StatePropsOfControl = mapStateToControlProps(state, ownProps);
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
 * Default mapStateToCellProps for enum control based on oneOf. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
export const mapStateToOneOfEnumControlProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl & OwnPropsOfEnum
): StatePropsOfControl & OwnPropsOfEnum => {
  const props: StatePropsOfControl = mapStateToControlProps(state, ownProps);
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
 * Default mapStateToCellProps for multi enum control. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
export const mapStateToMultiEnumControlProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl & OwnPropsOfEnum
): StatePropsOfControl & OwnPropsOfEnum => {
  const props: StatePropsOfControl = mapStateToControlProps(state, ownProps);
  let items = props.schema.items as JsonSchema;
  items =
    items && items.$ref
      ? resolveSchema(props.rootSchema, items.$ref, props.rootSchema)
      : items;
  const options: EnumOption[] =
    ownProps.options ||
    (items?.oneOf &&
      (items.oneOf as JsonSchema[]).map((oneOfSubSchema) =>
        oneOfToEnumOptionMapper(
          oneOfSubSchema,
          state.jsonforms.i18n?.translate,
          getI18nKeyPrefix(props.schema, props.uischema, props.path)
        )
      )) ||
    items?.enum?.map((e) =>
      enumToEnumOptionMapper(
        e,
        state.jsonforms.i18n?.translate,
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      )
    );
  return {
    ...props,
    options,
  };
};

/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToMasterListItemProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfMasterListItem
): StatePropsOfMasterItem => {
  const { schema, path, uischema, childLabelProp, index } = ownProps;
  const childPath = composePaths(path, `${index}`);
  const childLabel = computeChildLabel(
    getData(state),
    childPath,
    childLabelProp,
    schema,
    getSchema(state),
    state.jsonforms.i18n.translate,
    uischema
  );

  return {
    ...ownProps,
    childLabel,
  };
};

/**
 * State-based props of a table control.
 */
export interface StatePropsOfControlWithDetail extends StatePropsOfControl {
  uischemas?: JsonFormsUISchemaRegistryEntry[];
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

export interface OwnPropsOfMasterListItem {
  index: number;
  selected: boolean;
  path: string;
  enabled: boolean;
  schema: JsonSchema;
  uischema: UISchemaElement;
  childLabelProp?: string;
  handleSelect(index: number): () => void;
  removeItem(path: string, value: number): () => void;
  translations: ArrayTranslations;
  disableRemove?: boolean;
}

export interface StatePropsOfMasterItem extends OwnPropsOfMasterListItem {
  childLabel: string;
}

/**
 * Map state to control with detail props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
export const mapStateToControlWithDetailProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfControlWithDetail => {
  const { ...props } = mapStateToControlProps(state, ownProps);

  return {
    ...props,
    uischemas: state.jsonforms.uischemas,
  };
};

export interface ControlWithDetailProps
  extends StatePropsOfControlWithDetail,
    DispatchPropsOfControl {}

/**
 * State-based props of a table control.
 */
export interface StatePropsOfArrayControl
  extends StatePropsOfControlWithDetail {
  childErrors?: ErrorObject[];
}

/**
 * Map state to table props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
export const mapStateToArrayControlProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfArrayControl => {
  const { path, schema, uischema, label, ...props } =
    mapStateToControlWithDetailProps(state, ownProps);

  const resolvedSchema = Resolve.schema(schema, 'items', props.rootSchema);
  const childErrors = getSubErrorsAt(path, resolvedSchema)(state);

  return {
    ...props,
    label,
    path,
    uischema,
    schema: resolvedSchema,
    childErrors,
    renderers: ownProps.renderers || getRenderers(state),
    cells: ownProps.cells || getCells(state),
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfArrayControl {
  addItem(path: string, value: any): () => void;
  removeItems?(path: string, toDelete: number[]): () => void;
  moveUp?(path: string, toMove: number): () => void;
  moveDown?(path: string, toMove: number): () => void;
}

/**
 * Maps state to dispatch properties of an array control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an array control
 */
export const mapDispatchToArrayControlProps = (
  dispatch: Dispatch<CoreActions>
): DispatchPropsOfArrayControl => ({
  addItem: (path: string, value: any) => () => {
    dispatch(
      update(
        path,
        (array) => {
          if (array === undefined || array === null) {
            return [value];
          }

          array.push(value);
          return array;
        },
        { type: 'ADD', values: [value] } as UpdateArrayContext
      )
    );
  },
  removeItems: (path: string, toDelete: number[]) => () => {
    dispatch(
      update(
        path,
        (array) => {
          toDelete
            .sort((a, b) => a - b)
            .reverse()
            .forEach((s) => array.splice(s, 1));
          return array;
        },
        { type: 'REMOVE', indices: toDelete } as UpdateArrayContext
      )
    );
  },
  moveUp: (path, toMove: number) => () => {
    dispatch(
      update(
        path,
        (array) => {
          moveUp(array, toMove);
          return array;
        },
        {
          type: 'MOVE',
          moves: [{ from: toMove, to: toMove - 1 }],
        } as UpdateArrayContext
      )
    );
  },
  moveDown: (path, toMove: number) => () => {
    dispatch(
      update(
        path,
        (array) => {
          moveDown(array, toMove);
          return array;
        },
        {
          type: 'MOVE',
          moves: [{ from: toMove, to: toMove + 1 }],
        } as UpdateArrayContext
      )
    );
  },
});

export interface DispatchPropsOfMultiEnumControl {
  addItem: (path: string, value: any) => void;
  removeItem?: (path: string, toDelete: any) => void;
}

export const mapDispatchToMultiEnumProps = (
  dispatch: Dispatch<CoreActions>
): DispatchPropsOfMultiEnumControl => ({
  addItem: (path: string, value: any) => {
    dispatch(
      update(path, (data) => {
        if (data === undefined || data === null) {
          return [value];
        }
        data.push(value);
        return data;
      })
    );
  },
  removeItem: (path: string, toDelete: any) => {
    dispatch(
      update(path, (data) => {
        const indexInData = data.indexOf(toDelete);
        data.splice(indexInData, 1);
        return data;
      })
    );
  },
});

/**
 * Props of an array control.
 */
export interface ArrayControlProps
  extends StatePropsOfArrayControl,
    DispatchPropsOfArrayControl {}

export const layoutDefaultProps: {
  visible: boolean;
  enabled: boolean;
  path: string;
  direction: 'row' | 'column';
} = {
  visible: true,
  enabled: true,
  path: '',
  direction: 'column',
};

const getDirection = (uischema: UISchemaElement) => {
  if (uischema.type === 'HorizontalLayout') {
    return 'row';
  }
  if (uischema.type === 'VerticalLayout') {
    return 'column';
  }
  return layoutDefaultProps.direction;
};

/**
 * Map state to layout props.
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfLayout}
 */
export const mapStateToLayoutProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfLayout
): LayoutProps => {
  const rootData = getData(state);
  const { uischema } = ownProps;
  const visible: boolean =
    ownProps.visible === undefined || hasShowRule(uischema)
      ? isVisible(ownProps.uischema, rootData, ownProps.path, getAjv(state))
      : ownProps.visible;

  const data = Resolve.data(rootData, ownProps.path);
  const config = getConfig(state);
  const enabled: boolean = isInherentlyEnabled(
    state,
    ownProps,
    uischema,
    undefined, // layouts have no associated schema
    rootData,
    config
  );

  // some layouts have labels which might need to be translated
  const t = getTranslator()(state);
  const label = isLabelable(uischema)
    ? deriveLabelForUISchemaElement(uischema, t)
    : undefined;

  return {
    ...layoutDefaultProps,
    renderers: ownProps.renderers || getRenderers(state),
    cells: ownProps.cells || getCells(state),
    visible,
    enabled,
    path: ownProps.path,
    data,
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    direction: ownProps.direction ?? getDirection(uischema),
    config,
    label,
  };
};

export type RefResolver = (schema: JsonSchema) => Promise<JsonSchema>;

export interface OwnPropsOfJsonFormsRenderer extends OwnPropsOfRenderer {}

export interface StatePropsOfJsonFormsRenderer
  extends OwnPropsOfJsonFormsRenderer {
  rootSchema: JsonSchema;
  config: any;
}

export interface JsonFormsProps extends StatePropsOfJsonFormsRenderer {}

export const mapStateToJsonFormsRendererProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfJsonFormsRenderer
): StatePropsOfJsonFormsRenderer => {
  return {
    renderers: ownProps.renderers || get(state.jsonforms, 'renderers'),
    cells: ownProps.cells || get(state.jsonforms, 'cells'),
    schema: ownProps.schema || getSchema(state),
    rootSchema: getSchema(state),
    uischema: ownProps.uischema || getUiSchema(state),
    path: ownProps.path,
    enabled: ownProps.enabled,
    config: getConfig(state),
  };
};

export const controlDefaultProps = {
  ...layoutDefaultProps,
  errors: [] as string[],
};

export interface StatePropsOfCombinator extends StatePropsOfControl {
  rootSchema: JsonSchema;
  path: string;
  id: string;
  indexOfFittingSchema: number;
  uischemas: JsonFormsUISchemaRegistryEntry[];
  data: any;
}

export const mapStateToCombinatorRendererProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl,
  keyword: CombinatorKeyword
): StatePropsOfCombinator => {
  const { data, schema, rootSchema, i18nKeyPrefix, label, ...props } =
    mapStateToControlProps(state, ownProps);

  const ajv = state.jsonforms.core.ajv;
  const structuralKeywords = [
    'required',
    'additionalProperties',
    'type',
    'enum',
    'const',
  ];
  const dataIsValid = (errors: ErrorObject[]): boolean => {
    return (
      !errors ||
      errors.length === 0 ||
      !errors.find((e) => structuralKeywords.indexOf(e.keyword) !== -1)
    );
  };
  let indexOfFittingSchema: number;
  // TODO instead of compiling the combinator subschemas we can compile the original schema
  // without the combinator alternatives and then revalidate and check the errors for the
  // element
  for (let i = 0; i < schema[keyword]?.length; i++) {
    try {
      let _schema = schema[keyword][i];
      if (_schema.$ref) {
        _schema = Resolve.schema(rootSchema, _schema.$ref, rootSchema);
      }
      const valFn = ajv.compile(_schema);
      valFn(data);
      if (dataIsValid(valFn.errors)) {
        indexOfFittingSchema = i;
        break;
      }
    } catch (error) {
      console.debug(
        "Combinator subschema is not self contained, can't hand it over to AJV"
      );
    }
  }

  return {
    data,
    schema,
    rootSchema,
    ...props,
    i18nKeyPrefix,
    label,
    indexOfFittingSchema,
    uischemas: getUISchemas(state),
  };
};

export interface CombinatorRendererProps
  extends StatePropsOfCombinator,
    DispatchPropsOfControl {}
/**
 * Map state to all of renderer props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfCombinator} state props for a combinator
 */
export const mapStateToAllOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator =>
  mapStateToCombinatorRendererProps(state, ownProps, 'allOf');

export const mapStateToAnyOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator => {
  return mapStateToCombinatorRendererProps(state, ownProps, 'anyOf');
};

export const mapStateToOneOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator => {
  return mapStateToCombinatorRendererProps(state, ownProps, 'oneOf');
};

export interface StatePropsOfArrayLayout extends StatePropsOfControlWithDetail {
  data: number;
  minItems?: number;
  disableRemove?: boolean;
  disableAdd?: boolean;
}
/**
 * Map state to table props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
export const mapStateToArrayLayoutProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfArrayLayout => {
  const { path, schema, uischema, errors, label, ...props } =
    mapStateToControlWithDetailProps(state, ownProps);

  const resolvedSchema = Resolve.schema(schema, 'items', props.rootSchema);
  const t = getTranslator()(state);
  // TODO Does not consider 'i18n' keys which are specified in the ui schemas of the sub errors
  const childErrors = getCombinedErrorMessage(
    getSubErrorsAt(path, resolvedSchema)(state),
    getErrorTranslator()(state),
    t,
    undefined,
    undefined,
    undefined
  );

  const allErrors =
    errors +
    (errors.length > 0 && childErrors.length > 0 ? '\n' : '') +
    childErrors;
  return {
    ...props,
    label,
    path,
    uischema,
    schema: resolvedSchema,
    data: props.data ? props.data.length : 0,
    errors: allErrors,
    minItems: schema.minItems,
  };
};

/**
 * Props of an array control.
 */
export interface ArrayLayoutProps
  extends StatePropsOfArrayLayout,
    DispatchPropsOfArrayControl {}

export interface StatePropsOfLabel extends StatePropsOfRenderer {
  text?: string;
}
export interface LabelProps extends StatePropsOfLabel {}

export const mapStateToLabelProps = (
  state: JsonFormsState,
  props: OwnPropsOfLabel
) => {
  const { uischema } = props;

  const visible: boolean =
    props.visible === undefined || hasShowRule(uischema)
      ? isVisible(props.uischema, getData(state), props.path, getAjv(state))
      : props.visible;

  const text = uischema.text;
  const t = getTranslator()(state);
  const i18nKeyPrefix = getI18nKeyPrefixBySchema(undefined, uischema);
  const i18nKey = i18nKeyPrefix ? `${i18nKeyPrefix}.text` : text ?? '';
  const i18nText = t(i18nKey, text, { uischema });

  return {
    text: i18nText,
    visible,
    config: getConfig(state),
    renderers: props.renderers || getRenderers(state),
    cells: props.cells || getCells(state),
    uischema,
  };
};

/**
 * Compute the child label title for array based controls
 * @param data the data of the control
 * @param childPath the child path
 * @param childLabelProp the dotted path to the value used as child label
 * @param {JsonSchema} schema the json schema for this control
 * @param {JsonSchema} rootSchema the root json schema
 * @param {Translator} translateFct the translator fonction
 * @param {UISchemaElement} uiSchema the uiSchema of the control
 */
export const computeChildLabel = (
  data: any,
  childPath: string,
  childLabelProp: string,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  translateFct: Translator,
  uiSchema: UISchemaElement
): string => {
  const childData = Resolve.data(data, childPath);

  if (!childLabelProp) {
    childLabelProp = getFirstPrimitiveProp(schema);
  }

  // return early in case there is no prop we can query
  if (!childLabelProp) {
    return '';
  }

  const currentValue = get(childData, childLabelProp);

  // in case there is no value, then we can't map it to an enum or oneOf
  if (currentValue === undefined) {
    return '';
  }

  // check whether the value is part of a oneOf or enum and needs to be translated
  const childSchema = Resolve.schema(
    schema,
    '#' + getPropPath(childLabelProp),
    rootSchema
  );

  let enumOption: EnumOption = undefined;
  if (isEnumSchema(childSchema)) {
    enumOption = enumToEnumOptionMapper(
      currentValue,
      translateFct,
      getI18nKeyPrefix(
        childSchema,
        findUiControl(uiSchema, childLabelProp),
        childPath + '.' + childLabelProp
      )
    );
  } else if (isOneOfEnumSchema(childSchema)) {
    const oneOfArray = childSchema.oneOf as JsonSchema[];
    const oneOfSchema = oneOfArray.find((e: JsonSchema) =>
      isEqual(e.const, currentValue)
    );

    if (oneOfSchema) {
      enumOption = oneOfToEnumOptionMapper(
        oneOfSchema,
        translateFct,
        getI18nKeyPrefix(
          oneOfSchema,
          undefined,
          childPath + '.' + childLabelProp
        )
      );
    }
  }

  return enumOption ? enumOption.label : currentValue;
};
