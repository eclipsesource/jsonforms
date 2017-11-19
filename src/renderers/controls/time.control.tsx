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
 * Default tester for time controls.
 * @type {RankedTester}
 */
export const timeControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    formatIs('time')
));

export class TimeControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label } = this.props;

        const isValid = errors.length === 0;
        const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

        return (
            <div className={classNames.wrapper}>
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                <input type='time'
                       value={this.state.value}
                       onChange={(ev: Event<HTMLInputElement>) => {
                               this.handleChange(
                                   ev.currentTarget.value
                               );
                       }}
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
    timeControlTester,
    connect(mapStateToControlProps)(TimeControl)
);
