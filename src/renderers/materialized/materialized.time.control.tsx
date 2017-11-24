import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { timeControlTester } from '../controls/time.control';
import { connect } from '../../common/binding';
declare let $;
export class TimeControl extends Control<ControlProps, ControlState> {

  componentDidMount() {
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
      classNames.input += ' timepicker';
      const fixedId = '\'' + id + '\'';   // because label[for=#/properties/time] is erroneous

      return (
          <div className={classNames.wrapper}>
              <label htmlFor={fixedId} className={classNames.label} data-error={errors}>
                  {label}
              </label>
              <input type='text'
                     value={this.state.value}
                     onChange={ev => this.handleChange(ev.target.value)}
                     className={classNames.input}
                     id={fixedId}
                     hidden={!visible}
                     disabled={!enabled}
                     autoFocus={uischema.options && uischema.options.focus}
              />
          </div>
      );
  }
}

export default registerStartupRenderer(
    withIncreasedRank(1, timeControlTester),
    connect(mapStateToControlProps)(TimeControl)
);
