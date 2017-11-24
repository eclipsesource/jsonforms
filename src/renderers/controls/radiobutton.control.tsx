import { JSX } from '../JSX';
import { and, enumLengthAtMost, RankedTester } from '../../core/testers';
import { rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { update } from '../../actions';
import { connect, Event } from '../../common/binding';
import { Control, ControlProps, ControlState } from './Control';
import {
    formatErrorMessage,
    mapStateToControlProps,
    registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const radiobottonControlTester: RankedTester = rankWith(9, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum')),
    enumLengthAtMost(3)
));

export class RadiobuttonControl extends Control<ControlProps, ControlState> {

    render() {
        const  { uischema, schema, classNames, id, label,
            visible, enabled, data, path, errors, dispatch } = this.props;

        const isValid = errors.length === 0;
        const options = resolveSchema(
            schema,
            (uischema as ControlElement).scope.$ref
        ).enum;
        const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

        return (
            <div className={classNames.wrapper}>
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                <select
                    className={classNames.input}
                    hidden={!visible}
                    disabled={!enabled}
                    value={this.state.value}
                    onChange={(ev: Event<HTMLSelectElement>) =>
                        dispatch(update(path, () => ev.currentTarget.value))
                    }
                >
                    {
                        [<option value='' selected={data === undefined}/>]
                            .concat(
                                options.map(optionValue => {
                                    return (
                                        <option
                                            value={optionValue}
                                            label={optionValue}
                                            selected={data === optionValue}
                                            key={optionValue}
                                        >
                                            {optionValue}
                                        </option>
                                    );
                                })
                            )
                    }
                </select>
                <div className={divClassNames}>
                    {!isValid ? formatErrorMessage(errors) : ''}
                </div>
            </div>
        );
    }
}

export default registerStartupRenderer(
    radiobottonControlTester,
    connect(mapStateToControlProps)(RadiobuttonControl)
);
