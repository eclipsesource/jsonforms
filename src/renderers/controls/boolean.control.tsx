import { JSX } from '../JSX';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { BaseControl, mapStateToControlProps } from './base.control';
import { connect } from 'inferno-redux';
import { ControlProps } from './Control';
import { registerStartupRenderer } from '../renderer.util';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

export class BooleanControl extends BaseControl<ControlProps, void> {

  inputChangeProperty = 'onClick';
  valueProperty = 'checked';

  createInputElement() {
    const props: any = this.createProps();
    props.checked = this.props.data;

    return <input type='checkbox' {...props} />;
  }
}

export default registerStartupRenderer(
  booleanControlTester,
  connect(mapStateToControlProps)(BooleanControl)
);
