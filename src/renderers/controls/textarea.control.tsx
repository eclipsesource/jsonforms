import { JSX } from '../JSX';
import { and, optionIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    optionIs('multi', true)
  ));

export class TextAreaControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, path, dispatch,
      uischema, required } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label}>
          {required ? label + '*' : label}
        </label>
        <textarea
          value={this.state.value}
          onChange={(ev: Event<HTMLTextAreaElement>) =>
            this.handleChange(ev.currentTarget.value)
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
  textAreaControlTester,
  connect(mapStateToControlProps)(TextAreaControl)
);
