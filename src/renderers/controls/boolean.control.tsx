import { JSX } from '../JSX';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

export class BooleanControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='checkbox'
               checked={data}
               onClick={ev => this.updateData(ev.target.checked === true)}
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
        />
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
      </div>
    );
  }
}

export default registerStartupRenderer(
  booleanControlTester,
  connect(mapStateToControlProps)(BooleanControl)
);
