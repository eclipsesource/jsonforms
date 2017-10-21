import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { JsonForms } from '../../core';
import { BaseControl, mapStateToControlProps } from './base.control';
import { connect } from 'inferno-redux';
import { ControlProps } from './Control';

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    formatIs('date')
  ));

export class DateControl extends BaseControl<ControlProps, void> {

  inputChangeProperty = 'oninput';
  valueProperty = 'value';

  protected createInputElement() {
   return (<input type='date' {...this.createProps()} />);
   }

   /**
   * @inheritDoc
   */
  protected toInput(value: any): any {
    return new Date(value as string);
  }

  /**
   * @inheritDoc
   */
  protected toModel(value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    return new Date(value).toISOString().substr(0, 10);
  }
}

export default JsonForms.rendererService.registerRenderer(
  dateControlTester,
  connect(mapStateToControlProps)(DateControl)
);
