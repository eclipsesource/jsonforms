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
import { ControlElement, JsonSchema, UISchemaElement } from '../models';
import find from 'lodash/find';
import {
  findUISchema,
  getAjv,
  getCells,
  getConfig,
  getData,
  getErrorAt,
  getErrorTranslator,
  getRenderers,
  getSchema,
  getSubErrorsAt,
  getTranslator,
  getUiSchema,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
} from '../reducers';
import { RankedTester } from '../testers';
import { isInherentlyEnabled, hasShowRule } from './runtime';
import { createLabelDescriptionFrom } from './label';
import { CombinatorKeyword, resolveSubSchemas } from './combinators';
import { moveDown, moveUp } from './array';
import { AnyAction, Dispatch } from './type';
import { Resolve } from './util';
import { composePaths, composeWithUi } from './path';
import { isVisible } from './runtime';
import { CoreActions, update } from '../actions';
import { ErrorObject } from 'ajv';
import { JsonFormsState } from '../store';
import { getCombinedErrorMessage, getI18nKey, getI18nKeyPrefix, Translator } from '../i18n';

const isRequired = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema: JsonSchema
): boolean => {
  const pathSegments = schemaPath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
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
 * @param {string} label the label string
 * @param {boolean} required whether the label belongs to a control which is required
 * @param {boolean} hideRequiredAsterisk applied UI Schema option
 * @returns {string} the label string
 */
export const computeLabel = (
  label: string,
  required: boolean,
  hideRequiredAsterisk: boolean
): string => {
  return required && !hideRequiredAsterisk ? label + '*' : label;
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
 * Create a default value based on the given scheam.
 * @param schema the schema for which to create a default value.
 * @returns {any}
 */
export const createDefaultValue = (schema: JsonSchema) => {
  switch (schema.type) {
    case 'string':
      if (
        schema.format === 'date-time' ||
        schema.format === 'date' ||
        schema.format === 'time'
      ) {
        return new Date();
      }
      return '';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'null':
      return null;
    default:
      return {};
  }
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
  description: string,
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
  const i18nLabel = t(getI18nKey(schema, uischema, path, 'label'), label);
  const i18nDescription = t(getI18nKey(schema, uischema, path, 'description'), description);
  const i18nErrorMessage = getCombinedErrorMessage(errors, te, t, schema, uischema, path);

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
    rootSchema
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
  }
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
    props.schema.enum?.map(e =>
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
      )
    ]);
  return {
    ...props,
    options
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
    (props.schema.oneOf as JsonSchema[])?.map(oneOfSubSchema =>
      oneOfToEnumOptionMapper(
        oneOfSubSchema,
        getTranslator()(state),
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      )
    );
  return {
    ...props,
    options
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
  const items = props.schema.items as JsonSchema;
  const options: EnumOption[] =
    ownProps.options ||
    (items?.oneOf &&
      (items.oneOf as JsonSchema[]).map(oneOfSubSchema =>
        oneOfToEnumOptionMapper(
          oneOfSubSchema,
          state.jsonforms.i18n?.translate,
          getI18nKeyPrefix(props.schema, props.uischema, props.path)
        )
      )) ||
    items?.enum?.map(e =>
      enumToEnumOptionMapper(
        e,
        state.jsonforms.i18n?.translate,
        getI18nKeyPrefix(props.schema, props.uischema, props.path)
      )
    );
  return {
    ...props,
    options
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
  const { schema, path, index } = ownProps;
  const firstPrimitiveProp = schema.properties
    ? find(Object.keys(schema.properties), propName => {
        const prop = schema.properties[propName];
        return (
          prop.type === 'string' ||
          prop.type === 'number' ||
          prop.type === 'integer'
        );
      })
    : undefined;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);
  const childLabel = firstPrimitiveProp ? childData[firstPrimitiveProp] : '';

  return {
    ...ownProps,
    childLabel
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
  schema: JsonSchema;
  handleSelect(index: number): () => void;
  removeItem(path: string, value: number): () => void;
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
    uischemas: state.jsonforms.uischemas
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
  const { path, schema, uischema, ...props } = mapStateToControlWithDetailProps(
    state,
    ownProps
  );

  const resolvedSchema = Resolve.schema(schema, 'items', props.rootSchema);
  const childErrors = getSubErrorsAt(path, resolvedSchema)(state);

  return {
    ...props,
    path,
    uischema,
    schema: resolvedSchema,
    childErrors,
    renderers: ownProps.renderers || getRenderers(state),
    cells: ownProps.cells || getCells(state)
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
      update(path, array => {
        if (array === undefined || array === null) {
          return [value];
        }

        array.push(value);
        return array;
      })
    );
  },
  removeItems: (path: string, toDelete: number[]) => () => {
    dispatch(
      update(path, array => {
        toDelete
          .sort()
          .reverse()
          .forEach(s => array.splice(s, 1));
        return array;
      })
    );
  },
  moveUp: (path, toMove: number) => () => {
    dispatch(
      update(path, array => {
        moveUp(array, toMove);
        return array;
      })
    );
  },
  moveDown: (path, toMove: number) => () => {
    dispatch(
      update(path, array => {
        moveDown(array, toMove);
        return array;
      })
    );
  }
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
      update(path, data => {
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
      update(path, data => {
        const indexInData = data.indexOf(toDelete);
        data.splice(indexInData, 1);
        return data;
      })
    );
  }
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
  direction: 'column'
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
    direction: ownProps.direction ?? getDirection(uischema)
  };
};

export type RefResolver = (schema: JsonSchema) => Promise<JsonSchema>;

export interface OwnPropsOfJsonFormsRenderer extends OwnPropsOfRenderer {}

export interface StatePropsOfJsonFormsRenderer
  extends OwnPropsOfJsonFormsRenderer {
  rootSchema: JsonSchema;
}

export interface JsonFormsProps extends StatePropsOfJsonFormsRenderer {}

export const mapStateToJsonFormsRendererProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfJsonFormsRenderer
): StatePropsOfJsonFormsRenderer => {
  let uischema = ownProps.uischema;
  if (uischema === undefined) {
    if (ownProps.schema) {
      uischema = findUISchema(
        state.jsonforms.uischemas,
        ownProps.schema,
        undefined,
        ownProps.path
      );
    } else {
      uischema = getUiSchema(state);
    }
  }

  return {
    renderers: ownProps.renderers || get(state.jsonforms, 'renderers') || [],
    cells: ownProps.cells || get(state.jsonforms, 'cells') || [],
    schema: ownProps.schema || getSchema(state),
    rootSchema: getSchema(state),
    uischema: uischema,
    path: ownProps.path
  };
};

export const controlDefaultProps = {
  ...layoutDefaultProps,
  errors: [] as string[]
};

export interface StatePropsOfCombinator extends OwnPropsOfControl {
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
  const { uischema } = ownProps;
  const path = composeWithUi(uischema, ownProps.path);
  const rootSchema = getSchema(state);
  const resolvedSchema = Resolve.schema(
    ownProps.schema || rootSchema,
    uischema.scope,
    rootSchema
  );
  const visible: boolean =
    ownProps.visible === undefined || hasShowRule(uischema)
      ? isVisible(uischema, getData(state), ownProps.path, getAjv(state))
      : ownProps.visible;
  const id = ownProps.id;

  const data = Resolve.data(getData(state), path);

  const ajv = state.jsonforms.core.ajv;
  const schema = resolvedSchema || rootSchema;
  const _schema = resolveSubSchemas(schema, rootSchema, keyword);
  const structuralKeywords = [
    'required',
    'additionalProperties',
    'type',
    'enum',
    'const'
  ];
  const dataIsValid = (errors: ErrorObject[]): boolean => {
    return (
      !errors ||
      errors.length === 0 ||
      !errors.find(e => structuralKeywords.indexOf(e.keyword) !== -1)
    );
  };
  let indexOfFittingSchema: number;
  // TODO instead of compiling the combinator subschemas we can compile the original schema
  // without the combinator alternatives and then revalidate and check the errors for the
  // element
  for (let i = 0; i < _schema[keyword].length; i++) {
    try {
      const valFn = ajv.compile(_schema[keyword][i]);
      valFn(data);
      if (dataIsValid(valFn.errors)) {
        indexOfFittingSchema = i;
        break;
      }
    } catch (error) {
      console.debug("Combinator subschema is not self contained, can't hand it over to AJV");
    }
  }

  return {
    data,
    path,
    schema,
    rootSchema,
    visible,
    id,
    indexOfFittingSchema,
    uischemas: state.jsonforms.uischemas,
    uischema
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
  const {
    path,
    schema,
    uischema,
    errors,
    ...props
  } = mapStateToControlWithDetailProps(state, ownProps);

  const resolvedSchema = Resolve.schema(schema, 'items', props.rootSchema);

  // TODO Does not consider a specialized '.custom' error message overriding all other error messages
  // TODO Does not consider 'i18n' keys which are specified in the ui schemas of the sub errors
  const childErrors = getCombinedErrorMessage(
    getSubErrorsAt(path, resolvedSchema)(state),
    getErrorTranslator()(state),
    getTranslator()(state),
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
    path,
    uischema,
    schema: resolvedSchema,
    data: props.data ? props.data.length : 0,
    errors: allErrors,
    minItems: schema.minItems
  };
};

/**
 * Props of an array control.
 */
export interface ArrayLayoutProps
  extends StatePropsOfArrayLayout,
    DispatchPropsOfArrayControl {}
