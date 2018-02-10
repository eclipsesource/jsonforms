import * as _ from 'lodash';
import { connect } from 'react-redux';
import { JsonSchema } from '../models/jsonSchema';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { RankedTester } from '../testers';
import { ControlElement } from '../models/uischema';
import {
  getConfig,
  getData,
  getErrorAt,
  getPropsTransformer,
  getSubErrorsAt
} from '../reducers';
import { update } from '../actions';
import { DispatchPropsOfControl, Renderer, StatePropsOfControl } from '../renderers';
import { UISchemaElement } from '../models/uischema';
import { ErrorObject } from 'ajv';

/**
 * A renderer config that is used during renderer registration.
 */
export interface JsonFormsRendererConfig {
    /**
     * The tester that that determines how applicable
     * the renderer is.
     */
    tester: RankedTester;
}

/**
 * State props of a layout;
 */
export interface StatePropsOfLayout {
  /**
   * All available renderers.
   */
  renderers: Renderer[];
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
  const config = getConfig(state);

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
 * JSONForms specific connect function. This is a wrapper
 * around redux's connect function that executes any registered
 * prop transformers on the result of the given mapStateToProps
 * function before passing them to the actual connect function.
 *
 * @param {(state, ownProps) => any} mapStateToProps
 * @param {(dispatch, ownProps) => any} mapDispatchToProps
 * @returns {(Component) => any} function expecting a Renderer Component to be connected
 */
export const connectToJsonForms = (
  mapStateToProps: (state, ownProps) => any = mapStateToControlProps,
  mapDispatchToProps: (dispatch, ownProps) => any = mapDispatchToControlProps) => Component => {

  return connect(
    (state, ownProps) =>
      (getPropsTransformer(state) || []).reduce(
        (props, materializer) =>
          _.merge(props, materializer(state, props)),
        mapStateToProps(state, ownProps)
      ),
    mapDispatchToProps
  )(Component);
};

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

          const clone = _.clone(array);
          clone.push({});

          return clone;
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
