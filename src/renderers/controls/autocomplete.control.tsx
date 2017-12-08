import { JSX } from '../JSX';
import { and, enumLengthAtLeast, RankedTester } from '../../core/testers';
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
 * Default tester for autocomplete controls.
 * @type {RankedTester}
 */
export const autocompleteControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum')),
    enumLengthAtLeast(15)
));

export class AutocompleteControl extends Control<ControlProps, ControlState> {

    render() {
        const  { uischema, schema, classNames, id, label,
            visible, enabled, path, errors, dispatch } = this.props;

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
                <input
                    className={classNames.input}
                    hidden={!visible}
                    disabled={!enabled}
                    value={this.state.value}
                    onChange={(ev: Event<HTMLSelectElement>) =>
                        dispatch(update(path, () => ev.currentTarget.value))
                    }
                    list={id}
                />
                <datalist id={id}>
                    {
                        options.map(optionValue => {
                            return (
                                <option value={optionValue}/>
                            );
                        })
                    }
                </datalist>
              <div className={divClassNames}>
                {!isValid ? formatErrorMessage(errors) : ''}
              </div>
            </div>
        );
    }
}

export default registerStartupRenderer(
    autocompleteControlTester,
    connect(mapStateToControlProps)(AutocompleteControl)
);
