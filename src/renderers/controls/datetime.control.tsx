import { JSX } from '../JSX';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from './Control';
import {
    formatErrorMessage,
    mapStateToControlProps,
    registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for datetime controls.
 * @type {RankedTester}
 */
export const datetimeControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    formatIs('date-time')
));

export class DateTimeControl extends Control<ControlProps, void> {

    render() {
        const { data, classNames, id, visible, enabled, errors, label } = this.props;

        const localISOTime = (datestring: string): string => {
            const tzoffset = (new Date(datestring)).getTimezoneOffset() * 60000;
            // offset in milliseconds

            return (new Date(new Date(datestring).valueOf() - tzoffset))
                .toISOString().slice(0, -1) + 'Z';
        };

        const isValid = errors.length === 0;
        const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

        return (
            <div className={classNames.wrapper}>
                <label for={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                <input type='datetime-local'
                       value={data.substr(0, 16)}
                       onInput={ev =>
                           this.updateData(localISOTime(ev.target.value))
                       }
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

/* FIXME:
    the updateData() works fine on  new Date(ev.target.value).toISOString()
    (We can't use toISOString because it ignores the time offset and thus returns a wrong value)
    However, it does not update the data with the string specified above, that is localISOTime(...)
    I know it because the value field doesn't change when I inspect the control with the browser.
    Why is it not updated? How can we fix it?
*/

export default registerStartupRenderer(
    datetimeControlTester,
    connect(mapStateToControlProps)(DateTimeControl)
);
