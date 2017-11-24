import { JSX } from '../JSX';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import { resolveSchema } from '../../path.util';
import { ControlElement } from '../../models/uischema';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textControlTester: RankedTester = rankWith(1, isControl);

export class TextControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema, schema } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');
    const controlElement = uischema as ControlElement;
    const maxLength = resolveSchema(schema, controlElement.scope.$ref).maxLength;

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label}>
          {label}
        </label>
        <input value={this.state.value}
               onChange={
                 (ev: Event<HTMLInputElement>) =>
                   this.handleChange(ev.currentTarget.value)
               }
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
               maxlength={uischema.options && uischema.options.restrict ? maxLength : undefined}
               size={uischema.options && uischema.options.trim ? maxLength : undefined}
               style={uischema.options && uischema.options.trim ? 'width: initial' : ''}
        />
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
      </div>
    );
  }
}

export default registerStartupRenderer(
  textControlTester,
  connect(mapStateToControlProps)(TextControl)
);
