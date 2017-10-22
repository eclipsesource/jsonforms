import { JSX } from './JSX';
import * as _ from 'lodash';
import { JsonForms } from '../core';
import { isVisible, Renderer, RendererProps } from '../core/renderer';
import { RankedTester } from '../core/testers';
import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import DispatchRenderer from './dispatch-renderer';

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
        JsonForms.rendererService.registerRenderer(config.tester, cls);
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

  return elements.map(child => {
    const classes = JsonForms.stylingRegistry.get(
      childType,
      elements.length
    )
      .concat([childType])
      .join(' ');

    return (
      <div className={classes}>
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

// tslint:disable:variable-name
export const JsonFormsControl =
// tslint:enable:variable-name
  ({ classes, controlId, labelText, validationErrors, children }) => {

    const isValid = _.isEmpty(validationErrors);

    return (
      <div className={classes}>
        <label for={controlId} className='control.label'>
          { labelText }
        </label>
        {children}
        <div
          className={['validation'].concat([isValid ? '' : 'validation_error']).join(' ')}
        >
          { !isValid ? formatErrorMessage(validationErrors) : '' }
        </div>
      </div>
    );
  };

export const formatErrorMessage = errors => {
  if (errors === undefined || errors === null) {
    return '';
  }

  return errors.join('\n');
};
