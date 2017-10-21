import * as _ from 'lodash';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { BaseControl, mapStateToControlProps } from './base.control';
import { JsonForms } from '../../core';
import { connect } from 'inferno-redux';
import { ControlProps } from './Control';

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('number')
  ));

export class NumberControl extends BaseControl<ControlProps, void> {

  inputChangeProperty = 'onInput';
  valueProperty = 'value';

  /**
   * @inheritDoc
   */
  protected createInputElement() {
    return (
      <input
        type='number'
        {...this.createProps(
          [],
          {
            step: 0.1
          })
        }
      />
    );
  }

  /**
   * @inheritDoc
   */
  protected toModel(value: any): any {
    return _.toNumber(value);
  }

  /**
   * @inheritDoc
   */
  protected toInput(value: any): any {
    return value === undefined || value === null ? undefined : value;
  }
}

export default JsonForms.rendererService.registerRenderer(
  numberControlTester,
  connect(mapStateToControlProps)(NumberControl)
);
