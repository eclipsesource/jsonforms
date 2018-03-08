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
import { JsonSchema } from '../models/jsonSchema';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { RankedTester } from '../testers';
import { ControlElement, UISchemaElement } from '../models/uischema';
import {
  getConfig,
  getData,
  getErrorAt,
  getSchema,
  getSubErrorsAt,
  getUiSchema
} from '../reducers';
import { update } from '../actions';
import { ErrorObject } from 'ajv';

export interface Labels {
  default: string;
  [additonalLabels: string]: string;
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
   * Instacne path that is passed to the child elements.
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

export const mapStateToDispatchRendererProps = (state, ownProps) => ({
  renderers: state.jsonforms.renderers || [],
  schema: ownProps.schema || getSchema(state),
  uischema: ownProps.uischema || getUiSchema(state)
});

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
  const errors = getErrorAt(path)(state).map(error => error.message);
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
  addItem(path: string): void;
  removeItems(path: string, toDelete: any[]);
}

/**
 * Props of a table.
 */
export interface TableControlProps extends StatePropsOfTable, DispatchPropsOfTable {

}

/**
 * Map dispatch to table control props
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfTable} dispatch props for a table control
 */
export const mapDispatchToTableControlProps = (dispatch): DispatchPropsOfTable => ({
  addItem: (path: string) => () => {
    dispatch(
      update(
        path,
        array => {
          if (array === undefined || array === null) {
            return [{}];
          }

          array.push({});

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
          const clone = _.clone(array);
          toDelete.forEach(s => clone.splice(clone.indexOf(s), 1));

          return clone;
        }
      )
    );
  }
});
