import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { dateControlTester } from '../controls/date.control';

export class DateControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;

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
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, dateControlTester),
  connect(mapStateToControlProps)(DateControl)
);
