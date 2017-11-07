import { JSX } from '../JSX';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    formatIs('date')
  ));

export class DateControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='date'
               value={data}
               onInput={ev =>
                 this.updateData(new Date(ev.target.value).toISOString().substr(0, 10))
               }
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
  dateControlTester,
  connect(mapStateToControlProps)(DateControl)
);
