import { JSX } from '../JSX';
import { JsonForms } from '../../core';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { BaseControl, mapStateToControlProps } from './base.control';
import { connect } from 'inferno-redux';
import { ControlProps } from './Control';

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textControlTester: RankedTester = rankWith(1, isControl);

export class TextControl extends BaseControl<ControlProps, void> {

  inputChangeProperty = 'onInput';
  valueProperty = 'value';

  protected toInput(value: any): any {
    return value === undefined ? '' : value;
  }

  protected createInputElement() {
    return <input {...this.createProps()}/>;
  }
}

export default JsonForms.rendererService.registerRenderer(
  textControlTester,
  connect(mapStateToControlProps)(TextControl)
);
