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
import {
  findUISchema,
  getConfig,
  getData,
  getErrorAt,
  getRenderers,
  getSchema,
  getSubErrorsAt,
  getUiSchema
} from '../reducers';
import * as _ from 'lodash';
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

const isRequired = (schema: JsonSchema, schemaPath: string): boolean => {
  const pathSegments = schemaPath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const nextHigherSchemaSegments = pathSegments.slice(
    0,
    pathSegments.length - 2
  );
  const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
  const nextHigherSchema = Resolve.schema(schema, nextHigherSchemaPath);

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
}

export interface OwnPropsOfEnum {
  options?: any[];
}

/**
 * State-based props of a {@link Renderer}.
 */
export interface StatePropsOfRenderer extends OwnPropsOfRenderer {
  /**
   * Any configuration options for the element.
   */
  config?: any;
}

/**
 * State-based properties for UI schema elements that have a scope.
 */
export interface StatePropsOfScopedRenderer
  extends OwnPropsOfControl,
    StatePropsOfRenderer {
  // constraint type
  uischema: ControlElement;

  /**
   * Any validation errors that are caused by the data to be rendered.
   */
  errors?: any[];

  /**
   * The data to be rendered.
   */
  data?: any;

  /**
   * The absolute dot-separated path to the value being rendered.
   * A path is a sequence of property names separated by dots,
   * e.g. for accessing the value of b in the object
   * { foo: { a: { b: 42 } } }, one would use foo.a.b.
   */
  path: string;

  /**
   * Path of the parent renderer, if any.
   */
  parentPath?: string;

  /**
   * The sub-schema that describes the data this element is bound to.
   */
  scopedSchema: JsonSchema;

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
  handleChange?(path: string, value: any): void;
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
export interface StatePropsOfLayout extends OwnPropsOfRenderer {
  /**
   * All available renderers.
   */
  renderers: any[];
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
  const path = composeWithUi(uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(ownProps, state, ownProps.path);
  const enabled = _.has(ownProps, 'enabled')
    ? ownProps.enabled
    : isEnabled(ownProps, state, ownProps.path);
  const labelDesc = createLabelDescriptionFrom(uischema);
  const label = labelDesc.show ? labelDesc.text : '';
  const errors = _.union(getErrorAt(path)(state).map(error => error.message));
  const controlElement = uischema as ControlElement;
  const id = ownProps.id;
  const required =
    controlElement.scope !== undefined &&
    isRequired(ownProps.schema, controlElement.scope);
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope);
  const description =
    resolvedSchema !== undefined ? resolvedSchema.description : '';
  const defaultConfig = _.cloneDeep(getConfig(state));
  const config = _.merge(defaultConfig, controlElement.options);

  return {
    data: Resolve.data(getData(state), path),
    description,
    errors,
    label,
    visible,
    enabled,
    id,
    path,
    parentPath: ownProps.path,
    required,
    scopedSchema: resolvedSchema,
    uischema: ownProps.uischema,
    findUISchema: findUISchema(state),
    schema: ownProps.schema,
    config,
    fields: state.jsonforms.fields
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
  // not sure whether we want to expose ajv API
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
  const { path, schema, uischema, ...props } = mapStateToControlProps(
    state,
    ownProps
  );
  const controlElement = uischema as ControlElement;
  const resolvedSchema = Resolve.schema(
    schema,
    controlElement.scope + '/items'
  );
  const childErrors = getSubErrorsAt(path)(state);

  return {
    ...props,
    path,
    schema,
    uischema,
    scopedSchema: resolvedSchema,
    childErrors
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfArrayControl {
  addItem(path: string): () => void;
  removeItems(path: string, toDelete: any[]): () => void;
}

/**
 * Maps state to dispatch properties of an array control.
 *
 * @param dispatch the store's dispatch method
 * @param ownProps own properties
 * @returns {DispatchPropsOfArrayControl} dispatch props of an array control
 */
export const mapDispatchToArrayControlProps = (
  dispatch: Dispatch<AnyAction>,
  ownProps: OwnPropsOfControl
): DispatchPropsOfArrayControl => ({
  addItem: (path: string) => () => {
    dispatch(
      update(path, array => {
        const schemaPath = ownProps.uischema.scope + '/items';
        const resolvedSchema = Resolve.schema(ownProps.schema, schemaPath);
        const newValue = createDefaultValue(resolvedSchema);

        if (array === undefined || array === null) {
          return [newValue];
        }

        array.push(newValue);
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
  ownProps: StatePropsOfRenderer
): StatePropsOfLayout => {
  const visible: boolean = _.has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(ownProps, state, ownProps.path);

  return {
    renderers: getRenderers(state),
    visible,
    path: ownProps.path,
    uischema: ownProps.uischema,
    schema: ownProps.schema
  };
};

export interface JsonFormsProps extends StatePropsOfRenderer {
  renderers?: { tester: RankedTester; renderer: any }[];
}

export interface StatePropsOfJsonFormsRenderer extends OwnPropsOfRenderer {
  renderers: JsonFormsRendererRegistryEntry[];
}

export const mapStateToJsonFormsRendererProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfRenderer
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
    renderers: _.get(state.jsonforms, 'renderers') || [],
    schema: ownProps.schema || getSchema(state),
    uischema
  };
};
