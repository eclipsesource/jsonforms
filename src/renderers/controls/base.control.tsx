import { JSX } from '../JSX';
import * as _ from 'lodash';
import { JsonFormsControl } from '../renderer.util';
import { ControlElement } from '../../models/uischema';
import { getElementLabelObject } from '../label.util';
import { convertToClassName, isEnabled, isVisible, Renderer } from '../../core/renderer';
import { composeWithUi, resolveData } from '../../path.util';
import { update } from '../../actions';
import { getData, getValidation } from '../../reducers/index';
import { errorAt } from '../../reducers/validation';
import { ControlProps } from './Control';
import { JsonForms } from '../../core';

/**
 * Convenience base class for all renderers that represent controls.
 */
// TODO: remove HTMLElement reference
export abstract class BaseControl<P extends ControlProps, S> extends Renderer<P, S> {

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, labelText, errors } = this.props;
    const controlElement = uischema as ControlElement;

    const styles = JsonForms.stylingRegistry.get('control');
    const classes: string[] = !_.isEmpty(controlElement.scope) ?
      []
        .concat([`control ${convertToClassName(controlElement.scope.$ref)}`])
        .concat(styles)
      : [''];
    const controlId = _.has(controlElement.scope, '$ref') ? controlElement.scope.$ref : '';

    return (
      <JsonFormsControl
        classes={classes.join(' ')}
        controlId={controlId}
        labelText={labelText}
        validationErrors={errors}
        labelFirst={false}
        createValidationDiv={false}
      >
        {this.createInputElement()}
      </JsonFormsControl>
    );
  }

  /**
   * Convert the given value before setting it.
   * By default, this just resembles the identify function.
   *
   * @param {any} value the value that may need to be converted
   * @return {any} the converted value
   */
  protected toInput(value: any): any {
    return value;
  }

  /**
   * Convert the given value before displaying it.
   * By default, this just resembles the identify function.
   *
   * @param {any} value the value that may need to be converted
   * @return {any} the converted value
   */
  protected toModel(value: any): any {
    return value;
  }

  /**
   * Returns the name of the property that indicates changes
   * @example
   * 'onChange' // in case of a checkbox
   * @return {string} name of the change property
   */
  protected abstract get inputChangeProperty(): string;

  /**
   * Returns the name of the property that represents the actual value.
   * @example
   * 'checked' // in case of a checkbox
   * @return the name of the value property
   */
  protected abstract get valueProperty(): string;

  /**
   * Create and return a HTML element that is used
   * to enter/update any data.
   */
  protected abstract createInputElement();

  protected createProps(classNames: string[] = [], additionalProps: object = {}) {
    const { uischema, data, dispatch, visible, enabled, errors } = this.props;
    const controlElement = uischema as ControlElement;
    const isHidden = !visible;
    const isDisabled = !enabled;
    const isValid = _.isEmpty(errors);

    const props = {
      className: ['validate']
        .concat(isValid ? 'valid' : 'invalid')
        .concat(classNames).join(' '),
      id: controlElement.scope.$ref,
      hidden: isHidden,
      disabled: isDisabled,
    };

    props[this.valueProperty] = data;
    props[this.inputChangeProperty] = ev => {
      dispatch(update(this.props.path, () => this.getInputValue(ev.target)));
    };

    return _.merge(props, additionalProps);
  }

  protected getInputValue(input): any {
    return this.toModel(input[this.valueProperty]);
  }
}

export const mapStateToControlProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelObject = getElementLabelObject(ownProps.schema, ownProps.uischema);
  const labelText = labelObject.show ? labelObject.text : '';

  return {
    data: resolveData(getData(state), path),
    errors: errorAt(path)(getValidation(state)).map(error => error.message),
    labelText,
    visible,
    enabled,
    path
  };
};
