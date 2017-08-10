import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { BaseControl, mapStateToControlProps } from './base.control';
import { JsonForms } from '../../core';
import { connect } from 'inferno-redux';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

export class BooleanControl extends BaseControl<HTMLInputElement> {

  inputChangeProperty = 'onClick';
  valueProperty = 'checked';

  createInputElement() {
    const props = this.createProps();
    props['checked'] = this.props.data;

    return <input type='checkbox' {...props} />;
  }
}

export default JsonForms.rendererService.registerRenderer(
  booleanControlTester,
  connect(mapStateToControlProps)(BooleanControl)
);
