import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { dateControlTester } from '../controls/date.control';
import { connect, Event } from '../../common/binding';
declare let $;
export class DateControl extends Control<ControlProps, ControlState> {

  componentDidMount() {
    $('.datepicker').pickadate({
      format: 'yyyy-mm-dd', // we should actually use some localized format
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false // Close upon selecting a date,
    });
  }

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    classNames.input += ' datepicker';

    return (
      <div className={classNames.wrapper}>
        <input type='text'
               value={this.state.value || ''}
               onChange={ev => this.handleChange(ev.target.value)}
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
        />
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, dateControlTester),
  connect(mapStateToControlProps)(DateControl)
);
