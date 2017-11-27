import { JSX } from '../JSX';
import * as _ from 'lodash';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
  assembleDateTime,
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Default tester for datetime controls.
 * @type {RankedTester}
 */
export const datetimeControlTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  formatIs('date-time')
));

export class DateTimeControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');
    const value = this.state.value.toString();
    let date = value.substr(0, 10);
    let time = value.substr(11, 5);

    return (
      <div className={classNames.wrapper} style={'display: block;'}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='date'
               value={date}
               onChange={(ev: Event<HTMLInputElement>) => {
                 date = ev.currentTarget.value;
                 if (date && time) {
                   this.handleChange(
                     assembleDateTime(date, time)
                   );
                 }
                }
               }
               className={classNames.input}
               id={id + '-date'}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
               style={'width: 49%;'}
        />
        <input type='time'
               value={time}
               onChange={(ev: Event<HTMLInputElement>) => {
                 time = ev.currentTarget.value;
                 if (date && time) {
                   this.handleChange(
                     assembleDateTime(date, time)
                   );
                 }
                }
               }
               className={classNames.input}
               id={id + '-time'}
               hidden={!visible}
               disabled={!enabled}
               style={'width: 49%;'}
        />
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
      </div>
    );
  }
}

export default registerStartupRenderer(
  datetimeControlTester,
  connect(mapStateToControlProps)(DateTimeControl)
);
