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
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import union from 'lodash/union';
import RefParser from 'json-schema-ref-parser';
import {
  findUISchema,
  getConfig,
  getData,
  getErrorAt,
  getRefParserOptions,
  getRenderers,
  getSchema,
  getSubErrorsAt,
  getUiSchema
} from '../reducers';
import { RankedTester } from '../testers';
import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { update } from '../actions';
import { ErrorObject } from 'ajv';
import { generateDefaultUISchema } from '../generators';
import { JsonFormsState } from '../store';
import { AnyAction, Dispatch } from 'redux';
import { JsonFormsRendererRegistryEntry } from '../reducers/renderers';

export { JsonFormsRendererRegistryEntry };

export interface Labels {
  default: string;
  [additionalLabels: string]: string;
}

export const isPlainLabel = (label: string | Labels): label is string => {
  return typeof label === 'string';
};

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
 * @returns {string} the label string
 */
export const computeLabel = (label: string, required: boolean): string => {
  return required ? label + '*' : label;
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
  isFocused: boolean
): boolean => {
  return (
    description === undefined ||
    (description !== undefined && !visible) ||
    !isFocused
  );
};

export interface WithClassname {
  className?: string;
}

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
}

export interface OwnPropsOfControl extends OwnPropsOfRenderer {
  id?: string;
  // constraint type
  uischema?: ControlElement;
  renderers?: JsonFormsRendererRegistryEntry[];
}

export interface OwnPropsOfEnum {
  options?: any[];
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
  errors: string[];

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

  /**
   * Finds a registered UI schema to use, if any.
   * @param schema the JSON schema describing the data to be rendered
   * @param schemaPath the according schema path
   * @param path the instance path
   * @param fallbackLayoutType the type of the layout to use
   * @param control may be checked for embedded inline uischema options
   */
  findUISchema(
    schema: JsonSchema,
    schemaPath: string,
    path: string,
    fallbackLayoutType?: string,
    control?: ControlElement
  ): UISchemaElement;
}

/**
 * Props of a {@link Renderer}.
 */
export interface RendererProps extends StatePropsOfRenderer {}

/**
 * State-based props of a Control
 */
export interface StatePropsOfControl extends StatePropsOfScopedRenderer {
  fields?: { tester: RankedTester; field: any }[];

  /**
   * The label for the rendered element.
   */
  label: string | Labels;

  /**
   * Description of input field
   */
  description?: string;

  /**
   * Whether the rendered data is required.
   */
  required?: boolean;
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
   * All available renderers.
   */
  renderers?: any[];
}

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
  const visible = has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(uischema, rootData, ownProps.path);
  const enabled = has(ownProps, 'enabled')
    ? ownProps.enabled
    : isEnabled(uischema, rootData, ownProps.path);
  const labelDesc = createLabelDescriptionFrom(uischema);
  const label = labelDesc.show ? labelDesc.text : '';
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
  const errors = union(
    getErrorAt(path, resolvedSchema)(state).map(error => error.message)
  );
  const description =
    resolvedSchema !== undefined ? resolvedSchema.description : '';
  const defaultConfig = cloneDeep(getConfig(state));
  const config = merge(defaultConfig, controlElement.options);
  const data = Resolve.data(rootData, path);

  return {
    data,
    description,
    errors,
    label,
    visible,
    enabled,
    id,
    path,
    required,
    uischema: ownProps.uischema,
    findUISchema: findUISchema(state),
    schema: resolvedSchema || rootSchema,
    config,
    fields: state.jsonforms.fields,
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
 * State-based props of a table control.
 */
export interface StatePropsOfArrayControl extends StatePropsOfControl {
  childErrors?: ErrorObject[];
  renderers?: JsonFormsRendererRegistryEntry[];
  createDefaultValue(): any;
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
  const { path, schema, uischema, ...props } = mapStateToControlProps(
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
    createDefaultValue() {
      return createDefaultValue(resolvedSchema as JsonSchema);
    }
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfArrayControl {
  addItem(path: string, value: any): () => void;
  removeItems(path: string, toDelete: any[]): () => void;
}

/**
 * Maps state to dispatch properties of an array control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an array control
 */
export const mapDispatchToArrayControlProps = (
  dispatch: Dispatch<AnyAction>
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
  removeItems: (path: string, toDelete: any[]) => () => {
    dispatch(
      update(path, array => {
        toDelete.forEach(s => array.splice(array.indexOf(s), 1));
        return array;
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

/**
 * Map state to layout props.
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfLayout}
 */
export const mapStateToLayoutProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfJsonFormsRenderer
): StatePropsOfLayout => {
  const rootData = getData(state);
  const visible: boolean = has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(ownProps.uischema, rootData, ownProps.path);
  const enabled: boolean = has(ownProps, 'enabled')
    ? ownProps.enabled
    : isEnabled(ownProps.uischema, rootData, ownProps.path);

  return {
    ...layoutDefaultProps,
    renderers: ownProps.renderers || getRenderers(state),
    visible,
    enabled,
    path: ownProps.path,
    uischema: ownProps.uischema,
    schema: ownProps.schema
  };
};

export interface RefResolver {
  (schema: JsonSchema): Promise<any>;
}

export interface OwnPropsOfJsonFormsRenderer extends OwnPropsOfRenderer {
  renderers?: JsonFormsRendererRegistryEntry[];
}

export interface JsonFormsProps extends StatePropsOfJsonFormsRenderer {
  renderers?: JsonFormsRendererRegistryEntry[];
}

export interface StatePropsOfJsonFormsRenderer
  extends OwnPropsOfJsonFormsRenderer {
  rootSchema: JsonSchema;
  refResolver: RefResolver;
}

export const mapStateToJsonFormsRendererProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfJsonFormsRenderer
): StatePropsOfJsonFormsRenderer => {
  let uischema = ownProps.uischema;
  if (uischema === undefined) {
    if (ownProps.schema) {
      uischema = generateDefaultUISchema(ownProps.schema);
    } else {
      uischema = getUiSchema(state);
    }
  }

  return {
    renderers: ownProps.renderers || get(state.jsonforms, 'renderers') || [],
    schema: ownProps.schema || getSchema(state),
    rootSchema: getSchema(state),
    uischema: uischema,
    refResolver: function(schema) {
      return RefParser.dereference(schema as any, getRefParserOptions(state));
    }
  };
};

export const layoutDefaultProps = {
  visible: true,
  enabled: true,
  path: ''
};

export const controlDefaultProps = {
  ...layoutDefaultProps,
  errors: [] as string[]
};
