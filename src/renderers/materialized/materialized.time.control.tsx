import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { timeControlTester } from '../controls/time.control';
import { connect, Event } from '../../common/binding';

export class TimeControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label } = this.props;

        return (
            <div className={classNames.wrapper}>
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                <input type='time'
                       value={this.state.value}
                       onChange={(ev: Event<HTMLInputElement>) =>
                           this.handleChange(ev.currentTarget.value)
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
    withIncreasedRank(1, timeControlTester),
    connect(mapStateToControlProps)(TimeControl)
);
