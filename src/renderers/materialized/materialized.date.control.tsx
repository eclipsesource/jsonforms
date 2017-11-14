import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { dateControlTester } from '../controls/date.control';
import { connect, Event } from '../../common/binding';

export class DateControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='date'
               value={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) =>
                 this.handleChange(new Date(ev.currentTarget.value).toISOString().substr(0, 10))
               }
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
        />
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, dateControlTester),
  connect(mapStateToControlProps)(DateControl)
);
