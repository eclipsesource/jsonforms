import { JSX } from '../JSX';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

export class BooleanControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='checkbox'
               checked={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) =>
                 this.handleChange(ev.currentTarget.checked)
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
  booleanControlTester,
  connect(mapStateToControlProps)(BooleanControl)
);
