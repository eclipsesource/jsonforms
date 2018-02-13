import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';
import { JsonForms } from '../core';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve,
  translateLabel
} from '../util';
import { RankedTester } from '../testers';
import { ControlElement } from '../models/uischema';
import { getConfig, getData, getErrorAt, getSubErrorsAt, getTranslations } from '../reducers';
import { Renderer, RendererProps } from '../renderers/Renderer';
import { update } from '../actions';

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

export interface JsonFormsRendererConstructable {
  // TODO: any state?
  new(props: RendererProps): Renderer<RendererProps, any>;
}

export const mapStateToLayoutProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    renderers: state.renderers,
    visible,
    path: ownProps.path,
  };
};

export const registerStartupRenderer = (tester: RankedTester, renderer: any) => {
  JsonForms.renderers.push({
    tester,
    renderer
  });

  return renderer;
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

export const computeLabel = (label: string, required: boolean): string => {
   return required ? label + '*' : label;
 };

export const isDescriptionHidden = (visible, description, isFocused) => {
  return  description === undefined ||
  (description !== undefined && !visible) ||
  !isFocused;
};

export const isErrorVisible = (isValid: boolean, errors: string[], uischema: UISchemaElement) => {
  if (uischema.options && uischema.options.hasOwnProperty('displayError') && _.includes(errors, 'is a required property')) {
    return !isValid && uischema.options.displayError;
  }
  return !isValid;
};

export const mapStateToControlProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelDesc = translateLabel(getTranslations(state), createLabelDescriptionFrom(ownProps.uischema));
  const label = labelDesc.show ? labelDesc.text : '';
  const errors = getErrorAt(path)(state).map(error => error.message);
  const controlElement = ownProps.uischema as ControlElement;
  const id = controlElement.scope || '';
  const required =
      controlElement.scope !== undefined && isRequired(ownProps.schema, controlElement.scope);
  const fields = state.jsonforms.fields;
  const config = getConfig(state);

  return {
    data: Resolve.data(getData(state), path),
    errors,
    label,
    visible,
    enabled,
    id,
    path,
    parentPath: ownProps.path,
    fields,
    required,
    config
  };
};

export const mapDispatchToControlProps = dispatch => ({
  handleChange(path, value) {
    dispatch(update(path, () => value));
  }
});

export const mapStateToTableControlProps = (state, ownProps) => {
  const {path, ...props} = mapStateToControlProps(state, ownProps);

  const childErrors = getSubErrorsAt(path)(state);
  const controlElement = ownProps.uischema as ControlElement;
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope + '/items');

  return {
    ...props,
    path,
    childErrors,
    resolvedSchema
  };
};
export const mapDispatchToTableControlProps = dispatch => ({
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
