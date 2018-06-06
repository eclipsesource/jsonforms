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
import * as _ from 'lodash';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { RankedTester } from '../testers';
import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
import {
  findUISchema,
  getConfig,
  getData,
  getErrorAt,
  getSchema,
  getSubErrorsAt,
  getUiSchema
} from '../reducers';
import { update } from '../actions';
import { ErrorObject } from 'ajv';
import { generateDefaultUISchema } from '../generators';

export interface Labels {
  default: string;
  [additionalLabels: string]: string;
}

export const isPlainLabel = (label: string | Labels): label is string => {
  return typeof label === 'string';
};

/**
 * State-based props of a {@link Renderer}.
 */
export interface StatePropsOfRenderer {
  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  /**
   * Whether the rendered element should be visible.
   */
  visible?: boolean;

  /**
   * Whether the rendered element should be enabled.
   */
  enabled?: boolean;

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;

  /**
   * Any configuration options for the element.
   */
  config?: any;
}

/**
 * State-based properties for UI schema elements that have a scope.
 */
export interface StatePropsOfScopedRenderer extends StatePropsOfRenderer {

  /**
   * The data to be rendered.
   */
  data: any;

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
   * An unique ID that can be used to identify the rendered element.
   */
  id: string;

  findUISchema(schema: JsonSchema, schemaPath: string, path: string);
}
/**
 * Props of a {@link Renderer}.
 */
export interface RendererProps extends StatePropsOfRenderer { }

/**
 * State-based props of a Control
 */
export interface StatePropsOfControl extends StatePropsOfScopedRenderer {

  /**
   * Any validation errors that are caused by the data to be rendered.
   */
  errors: any[];

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
  required: boolean;

  /**
   * The schema that corresponds to the data the control is bound to.
   */
  scopedSchema: JsonSchema;
}
/**
 * Props of a Control.
 */
export interface ControlProps extends StatePropsOfControl, DispatchPropsOfControl {}
/**
 * State props of a layout;
 */
export interface StatePropsOfLayout {
  /**
   * All available renderers.
   */
  renderers: any[];
  /**
   * Whether the layout is visible.
   */
  visible: boolean;

  /**
   * Instance path that is passed to the child elements.
   */
  path: string;

  /**
   * The corresponding UI schema.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that is passed to the child elements.
   */
  schema: JsonSchema;
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

export interface JsonFormsProps extends StatePropsOfScopedRenderer {
  renderers?: { tester: RankedTester, renderer: any }[];
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
  handleChange(path: string, value: any);
}

export const mapStateToDispatchRendererProps = (state, ownProps) => {
  let uischema = ownProps.uischema;
  if (uischema === undefined) {
    if (ownProps.schema) {
      uischema = generateDefaultUISchema(ownProps.schema);
    } else {
      uischema = getUiSchema(state);
    }
  }

  return {
    renderers: state.jsonforms.renderers || [],
    schema: ownProps.schema || getSchema(state),
    uischema
  };
};

/**
 * Map state to layout props.
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfLayout}
 */
export const mapStateToLayoutProps = (state, ownProps): StatePropsOfLayout => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    renderers: state.renderers,
    visible,
    path: ownProps.path,
    uischema: ownProps.uischema,
    schema: ownProps.schema
  };
};

const isRequired = (schema: JsonSchema, schemaPath: string): boolean => {
     const pathSegments = schemaPath.split('/');
     const lastSegment = pathSegments[pathSegments.length - 1];
     const nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
     const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
     const nextHigherSchema = Resolve.schema(schema, nextHigherSchemaPath);

     return nextHigherSchema !== undefined
         && nextHigherSchema.required !== undefined
         && nextHigherSchema.required.indexOf(lastSegment) !== -1;
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
 * Whether an element's description should be hidden.
 *
 * @param visible whether an element is visible
 * @param description the element's description
 * @param isFocused whether the element is focused
 *
 * @returns {boolean} true, if the description is to be hidden, false otherwise
 */
export const isDescriptionHidden =
  (visible: boolean, description: string, isFocused: boolean): boolean => {

  return  description === undefined ||
  (description !== undefined && !visible) ||
  !isFocused;
};

/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToControlProps = (state, ownProps): StatePropsOfControl => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelDesc = createLabelDescriptionFrom(ownProps.uischema);
  const label = labelDesc.show ? labelDesc.text : '';
  const errors = _.union(getErrorAt(path)(state).map(error => error.message));
  const controlElement = ownProps.uischema as ControlElement;
  const id = controlElement.scope || '';
  const required =
      controlElement.scope !== undefined && isRequired(ownProps.schema, controlElement.scope);
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope);
  const description = resolvedSchema !== undefined ? resolvedSchema.description : '';
  const defaultConfig = _.cloneDeep(getConfig(state));
  const config = _.merge(
    defaultConfig,
    controlElement.options
  );

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
    config
  };
};

/**
 *
 * Map dispatch to control props.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfControl} dispatch props for a control
 */
export const mapDispatchToControlProps = (dispatch): DispatchPropsOfControl => ({
  handleChange(path, value) {
    dispatch(update(path, () => value));
  }
});

/**
 * State-based props of a table control.
 */
export interface StatePropsOfTable extends StatePropsOfControl {
  // not sure whether we want to expose ajv API
  childErrors: ErrorObject[];
}

/**
 * Map state to table props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfTable} state props for a table control
 */
export const mapStateToTableControlProps = (state, ownProps): StatePropsOfTable => {
  const {path, ...props} = mapStateToControlProps(state, ownProps);
  const controlElement = ownProps.uischema as ControlElement;
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope + '/items');

  const childErrors = getSubErrorsAt(path)(state);

  return {
    ...props,
    scopedSchema: resolvedSchema,
    path,
    childErrors
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfTable {
  addItem(path: string): () => void;
  removeItems(path: string, toDelete: any[]);
}

/**
 * Props of a table.
 */
export interface TableControlProps extends StatePropsOfTable, DispatchPropsOfTable {

}

/**
 * Create a default value based on the given scheam.
 * @param schema the schema for which to create a default value.
 * @returns {any}
 */
export const createDefaultValue = schema => {
    switch (schema.type) {
        case 'string':
            if (schema.format === 'date-time'
                || schema.format === 'date'
                || schema.format === 'time') {
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
 * Map dispatch to table control props
 *
 * @param dispatch the store's dispatch method
 * @param ownProps own properties
 * @returns {DispatchPropsOfTable} dispatch props for a table control
 */
export const mapDispatchToTableControlProps = (dispatch, ownProps): DispatchPropsOfTable => ({
  addItem: (path: string) => () => {
    dispatch(
      update(
        path,
        array => {
          const schemaPath = ownProps.uischema.scope + '/items';
          const resolvedSchema = Resolve.schema(ownProps.schema, schemaPath);
          const newValue = createDefaultValue(resolvedSchema);

          if (array === undefined || array === null) {
            return [newValue];
          }

          array.push(newValue);
          return array;
        }
      )
    );
  },
  removeItems: (path: string, toDelete: any[]) => () => {
    dispatch(
      update(
        path,
        array => {
          toDelete.forEach(s => array.splice(array.indexOf(s), 1));
          return array;
        }
      )
    );
  }
});
