import { JSX } from '../JSX';
import * as _ from 'lodash';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateControlTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  formatIs('date')
));

export class DateControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='date'
               value={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) => {
                 if (_.isDate(ev.currentTarget.value)) {
                   this.handleChange(
                     new Date(ev.currentTarget.value).toISOString().substr(0, 10)
                   );
                 }
               }}
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
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
