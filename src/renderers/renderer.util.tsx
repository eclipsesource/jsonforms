import { JsonSchema } from '../models/jsonSchema';
import { JSX } from './JSX';
import { JsonForms } from '../core';
import {
  convertToClassName,
  isEnabled,
  isVisible,
  Renderer,
  RendererProps
} from '../core/renderer';
import { RankedTester } from '../core/testers';
import { ControlElement, UISchemaElement } from '../models/uischema';
import * as _ from 'lodash';
import DispatchRenderer from './dispatch-renderer';
import { composeWithUi, resolveData } from '../path.util';
import { getElementLabelObject } from './label.util';
import { errorAt } from '../reducers/validation';
import { getData, getValidation } from '../reducers/index';

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

export const formatErrorMessage = errors => {
  if (errors === undefined || errors === null) {
    return '';
  }

  return errors.join('\n');
};

export const registerStartupRenderer = (tester: RankedTester, renderer: any) => {
  JsonForms.renderers.push({
    tester,
    renderer
  });

  return renderer;
};

/**
 * returns a string in simplified extended ISO format (ISO 8601), which is always
 * 24 characters long (YYYY-MM-DDTHH:mm:ss.sssZ).
 *
 * @param {string} date the date to be included in format YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string} time the time to be included in format HH:mm
 * @returns {string} combination of the two input parameters in ISO format (ISO 8601)
 *                    YYYY-MM-DDTHH:mm:ss.sssZ
 */
export const assembleDateTime = (date: string, time: string): string => {
  const resultDate: string = new Date(date).toISOString().substr(0, 11);
  const resultTime: string = time + ':00.000Z';

  return resultDate + resultTime;
};

export const mapStateToControlProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelObject = getElementLabelObject(ownProps.schema, ownProps.uischema);
  const label = labelObject.show ? labelObject.text : '';
  const errors = errorAt(path)(getValidation(state)).map(error => error.message);
  const isValid = _.isEmpty(errors);
  const controlElement = ownProps.uischema as ControlElement;
  const id = _.has(controlElement.scope, '$ref') ? controlElement.scope.$ref : '';

  const styles = JsonForms.stylingRegistry.get('control');
  const classNames: string[] = !_.isEmpty(controlElement.scope) ?
    styles.concat(
      [`${convertToClassName(controlElement.scope.$ref)}`]
    ) : [''];
  const inputClassName =
    ['validate']
      .concat(isValid ? 'valid' : 'invalid');
  const labelClass = JsonForms.stylingRegistry.getAsClassName('control.label');

  return {
    data: resolveData(getData(state), path),
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
  };
};
