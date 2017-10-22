import { JSX } from '../JSX';
import { and, optionIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { BaseControl, mapStateToControlProps } from './base.control';
import { connect } from 'inferno-redux';
import { ControlProps } from './Control';
import { registerStartupRenderer } from '../renderer.util';
/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    optionIs('multi', true)
  ));

export class TextAreaControl extends BaseControl<ControlProps, void> {

  protected inputChangeProperty = 'onInput';
  protected valueProperty = 'value';

  protected createInputElement() {
    return (<textarea {...this.createProps()}/>);
  }

  /**
   * @inheritDoc
   */
  protected toInput(value: any): any {
    return (value === undefined || value === null) ? '' : value;
  }
}

export default registerStartupRenderer(
  textAreaControlTester,
  connect(mapStateToControlProps)(TextAreaControl)
);
