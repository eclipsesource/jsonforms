import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import {
  assembleDateTime, mapStateToControlProps, registerStartupRenderer
} from '../renderer.util';
import { datetimeControlTester } from '../controls/datetime.control';
import { connect } from '../../common/binding';
declare let $;
export class DateTimeControl extends Control<ControlProps, ControlState> {

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
    $('.timepicker').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: false, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true // make AM PM clickable
    });
  }

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;

    const value = this.state.value.toString();

    const fixedIdDate = '\'' + id + '-date\'';  // because label[for=#/properties/time] is erroneous
    const classNamesDate = $.extend(true, {}, classNames);  // clone
    classNamesDate.input += ' datepicker';
    let date = value.substr(0, 10);

    const fixedIdTime = '\'' + id + '-time\'';  // because label[for=#/properties/time] is erroneous
    const classNamesTime = $.extend(true, {}, classNames);  // clone
    classNamesTime.input += ' timepicker';
    let time = value.substr(11, 5);

    return (
      <div className={classNames.wrapper}>
        <div style={'width: 50%; float: left;'}>
          <label htmlFor={fixedIdDate} className={classNamesDate.label} data-error={errors}>
            {label}
          </label>
          <input type='text'
                 value={date}
                 onChange={ev => {
                   date = ev.target.value;
                   if (date && time) {
                    this.handleChange(assembleDateTime(date, time));
                   }
                  }
                 }
                 className={classNamesDate.input}
                 id={fixedIdDate}
                 hidden={!visible}
                 disabled={!enabled}
                 autoFocus={uischema.options && uischema.options.focus}
          />
        </div>
        <div style={'width: 50%; float: left;'}>
          <input type='text'
                 value={time}
                 onChange={ev => {
                   time = ev.target.value;
                   if (date && time) {
                    this.handleChange(assembleDateTime(date, time));
                   }
                  }
                 }
                 className={classNamesTime.input}
                 id={fixedIdTime}
                 hidden={!visible}
                 disabled={!enabled}
          />
        </div>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, datetimeControlTester),
  connect(mapStateToControlProps)(DateTimeControl)
);
