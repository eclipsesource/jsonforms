import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { JsonForms } from '../core';
import {
  composeWithUi,
  convertToValidClassName,
  createLabelDescriptionFrom,
  isEnabled, isVisible, Resolve
} from '../helpers';
import { RankedTester } from '../testers';
import { ControlElement, UISchemaElement } from '../models/uischema';
import * as React from 'react';
import DispatchRenderer from './dispatch-renderer';
import { errorAt, subErrorsAt } from '../reducers/validation';
import { getData, getValidation } from '../reducers';
import { Renderer, RendererProps } from './renderer';
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

/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
// Used as annotation
// tslint:disable:variable-name
export const JsonFormsRenderer =
    (config: JsonFormsRendererConfig) =>
      (cls: JsonFormsRendererConstructable) => {
        registerStartupRenderer(config.tester, cls);
      };
// tslint:enable:variable-name

export const mapStateToLayoutProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    renderers: state.renderers,
    visible,
    path: ownProps.path
  };
};

export const renderChildren = (
  elements: UISchemaElement[],
  schema: JsonSchema,
  childType: string,
  path: string
) => {

  if (_.isEmpty(elements)) {
    return [];
  }

  return elements.map((child, index) => {
    const classes = JsonForms.stylingRegistry.get(
      childType,
      elements.length
    )
      .concat([childType])
      .join(' ');

    return (
      <div className={classes} key={`${path}-${index}`}>
        <DispatchRenderer
          uischema={child}
          schema={schema}
          path={path}
        />
      </div>
    );
  });
};

// tslint:disable:variable-name
export const JsonFormsLayout = ({ styleName, children, visible }) => {
// tslint:enable:variable-name
  const classNames = JsonForms.stylingRegistry.getAsClassName(styleName);

  return (
    <div className={classNames}
         hidden={visible === undefined || visible === null ? false : !visible}
    >
      {children}
    </div>
  );
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

export const mapStateToControlProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelDesc = createLabelDescriptionFrom(ownProps.uischema);
  const label = labelDesc.show ? labelDesc.text : '';
  const errors = errorAt(path)(getValidation(state)).map(error => error.message);
  const isValid = _.isEmpty(errors);
  const controlElement = ownProps.uischema as ControlElement;
  const id = _.has(controlElement.scope, '$ref') ? controlElement.scope.$ref : '';
  const required =
      controlElement.scope !== undefined && isRequired(ownProps.schema, controlElement.scope.$ref);

  const styles = JsonForms.stylingRegistry.get('control');
  let classNames: string[] = !_.isEmpty(controlElement.scope) ?
    styles.concat(
      [`${convertToValidClassName(controlElement.scope.$ref)}`]
    ) : [''];
  const trim = ownProps.uischema.options && ownProps.uischema.options.trim;
  if (trim) {
    classNames = classNames.concat(JsonForms.stylingRegistry.get('control.trim'));
  }
  const inputClassName =
    ['validate']
      .concat(isValid ? 'valid' : 'invalid');
  const labelClass = JsonForms.stylingRegistry.getAsClassName('control.label');
  const inputs = state.inputs;

  return {
    data: Resolve.data(getData(state), path),
    errors,
    classNames: {
      wrapper: classNames.join(' '),
      input: inputClassName.join(' '),
      label: labelClass
    },
    label,
    visible,
    enabled,
    id,
    path,
    inputs,
    required
  };
};
export const mapStateToTableControlProps = (state, ownProps) => {
  const {path, ...props} = mapStateToControlProps(state, ownProps);

  const childErrors = subErrorsAt(path)(getValidation(state));
  const controlElement = ownProps.uischema as ControlElement;
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope.$ref + '/items');

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
