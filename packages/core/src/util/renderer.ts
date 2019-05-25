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
import { ControlElement, UISchemaElement } from '../models/uischema';
import union from 'lodash/union';
import RefParser from 'json-schema-ref-parser';
import {
  getConfig,
  getData,
  getErrorAt,
  getRefParserOptions,
  getRenderers,
  getSchema,
  getSubErrorsAt,
  getUiSchema,
  UISchemaTester
} from '../reducers';
import { RankedTester } from '../testers';
import { JsonSchema } from '../models/jsonSchema';
import {
  CombinatorKeyword,
  composeWithUi,
  createLabelDescriptionFrom,
  formatErrorMessage,
  isEnabled,
  isVisible,
  Resolve,
  resolveSubSchemas
} from '../util';
import has from 'lodash/has';
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

  renderers?: JsonFormsRendererRegistryEntry[];
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
export interface RendererProps extends StatePropsOfRenderer { }

/**
 * State-based props of a Control
 */
export interface StatePropsOfControl extends StatePropsOfScopedRenderer {
  cells?: { tester: RankedTester; cell: any }[];

  /**
   * The label for the rendered element.
   */
  label: string | Labels;

  /**
   * Description of input cell
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
  DispatchPropsOfControl { }

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
  const errors = formatErrorMessage(
    union(getErrorAt(path, resolvedSchema)(state).map(error => error.message))
  );
  const description =
    resolvedSchema !== undefined ? resolvedSchema.description : '';
  const data = Resolve.data(rootData, path);
  const labelDesc = createLabelDescriptionFrom(uischema, resolvedSchema);
  const label = labelDesc.show ? labelDesc.text : '';
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
    schema: resolvedSchema || rootSchema,
    config: getConfig(state),
    cells: state.jsonforms.cells,
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
  const options =
    ownProps.options !== undefined ? ownProps.options : props.schema.enum;
  return {
    ...props,
    options
  };
};

/**
 * State-based props of a table control.
 */
export interface StatePropsOfControlWithDetail extends StatePropsOfControl {
  uischemas?: { tester: UISchemaTester; uischema: UISchemaElement }[];
  renderers?: JsonFormsRendererRegistryEntry[];
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
  DispatchPropsOfControl { }

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
    renderers: ownProps.renderers || getRenderers(state)
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfArrayControl {
  addItem(path: string, value: any): () => void;
  removeItems?(path: string, toDelete: number[]): () => void;
  moveUp?(path: string, indexToMove: number): () => any;
  moveDown?(path: string, indexToMove: number): () => any;

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
        if (toMove == 0) {
          return array;
        }
        let temp = array[toMove];
        array[toMove] = array[toMove - 1]
        array[toMove - 1] = temp;
        return array;
      })
    );
  },
  moveDown: (path, toMove: number) => () => {
    dispatch(
      update(path, array => {
        if (toMove == array.length - 1) {
          return array;
        }
        let temp = array[toMove];
        array[toMove] = array[toMove + 1]
        array[toMove + 1] = temp;
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
  DispatchPropsOfArrayControl { }

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

export type RefResolver = (schema: JsonSchema) => Promise<JsonSchema>;

export interface OwnPropsOfJsonFormsRenderer extends OwnPropsOfRenderer {
  renderers?: JsonFormsRendererRegistryEntry[];
}

export interface JsonFormsProps extends StatePropsOfJsonFormsRenderer {
  renderers?: JsonFormsRendererRegistryEntry[];
}

export interface StatePropsOfJsonFormsRenderer
  extends OwnPropsOfJsonFormsRenderer {
  rootSchema: JsonSchema;
  refResolver: any;
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
    refResolver: (schema: any) =>
      RefParser.dereference(schema, getRefParserOptions(state))
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

export interface StatePropsOfCombinator {
  schema: JsonSchema;
  rootSchema: JsonSchema;
  path: string;
  visible: boolean;
  id: string;
  indexOfFittingSchema: number;
}
export interface CombinatorRendererProps
  extends StatePropsOfCombinator,
  DispatchPropsOfControl { }
/**
 * Map state to all of renderer props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfCombinator} state props for a combinator
 */
export const mapStateToAllOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator => {
  return mapStateToCombinatorRendererProps(state, ownProps, 'allOf');
};

export const mapStateToOneOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator => {
  return mapStateToCombinatorRendererProps(state, ownProps, 'oneOf');
};

export const mapStateToAnyOfProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfCombinator => {
  return mapStateToCombinatorRendererProps(state, ownProps, 'anyOf');
};

const mapStateToCombinatorRendererProps = (
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
  const visible = has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(uischema, getData(state), ownProps.path);
  const id = ownProps.id;

  const data = Resolve.data(getData(state), path);

  const ajv = state.jsonforms.core.ajv;
  const schema = resolvedSchema || rootSchema;
  const _schema = resolveSubSchemas(schema, rootSchema, keyword);
  const structuralKeywords = ['required', 'additionalProperties', 'type'];
  const dataIsValid = (errors: ErrorObject[]): boolean => {
    return (
      !errors ||
      errors.length === 0 ||
      !errors.find(e => structuralKeywords.indexOf(e.keyword) !== -1)
    );
  };
  let indexOfFittingSchema: number;
  for (let i = 0; i < _schema[keyword].length; i++) {
    const valFn = ajv.compile(_schema[keyword][i]);
    valFn(data);
    if (dataIsValid(valFn.errors)) {
      indexOfFittingSchema = i;
      break;
    }
  }

  return {
    path,
    schema,
    rootSchema,
    visible,
    id,
    indexOfFittingSchema
  };
};

export interface StatePropsOfArrayLayout extends StatePropsOfControlWithDetail {
  data: number;
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
  const childErrors = formatErrorMessage(
    getSubErrorsAt(path, resolvedSchema)(state).map(error => error.message)
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
    errors: allErrors
  };
};

/**
 * Props of an array control.
 */
export interface ArrayLayoutProps
  extends StatePropsOfArrayLayout,
  DispatchPropsOfArrayControl { }
