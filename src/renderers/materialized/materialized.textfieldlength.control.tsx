import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textfieldlengthControlTester } from '../controls/textfieldlength.control';
import { connect, Event } from '../../common/binding';

export class MaterializedTextfieldlengthControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label } = this.props;

        return (
            <div className={classNames.wrapper}>
                <input value={this.state.value.default}
                       onChange={(ev: Event<HTMLInputElement>) =>
                           this.handleChange(ev.currentTarget.value)
                       }
                       className={classNames.input}
                       id={id}
                       hidden={!visible}
                       disabled={!enabled}
                       maxlength={this.state.value.maxlength}
                       style={'width :' + this.state.value.maxlength * 15 + 'px;'}
                />
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
            </div>
        );
    }
}

export default registerStartupRenderer(
    withIncreasedRank(1, textfieldlengthControlTester),
    connect(mapStateToControlProps)(MaterializedTextfieldlengthControl)
);
