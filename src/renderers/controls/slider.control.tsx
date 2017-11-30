import { JSX } from '../JSX';
import * as _ from 'lodash';
import {
  and,
  optionIs,
  RankedTester,
  rankWith,
  schemaTypeIs,
  uiTypeIs
} from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
    formatErrorMessage,
    mapStateToControlProps,
    registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

export const sliderControlTester: RankedTester = rankWith(4, and(
    uiTypeIs('Control'),
    schemaTypeIs('number'),
    optionIs('slider', true)
));

export class SliderControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label, uischema, schema } = this.props;
        const isValid = errors.length === 0;
        const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

        return (
            <div className={classNames.wrapper}>
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                <input type='range'
                       min='0'
                       max='100'
                       value={this.state.value}
                       onChange={(ev: Event<HTMLInputElement>) =>
                           this.handleChange(_.toNumber(ev.currentTarget.value))
                       }
                       className={classNames.input}
                       id={id}
                       hidden={!visible}
                       disabled={!enabled}
                       autoFocus={uischema.options && uischema.options.focus}
                />
                <div className={divClassNames}>
                    {!isValid ? formatErrorMessage(errors) : ''}
                </div>
            </div>
        );
    }
}

export default registerStartupRenderer(
    sliderControlTester,
    connect(mapStateToControlProps)(SliderControl)
);
