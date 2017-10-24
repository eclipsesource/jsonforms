import { JSX } from '../JSX';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textControlTester: RankedTester = rankWith(1, isControl);

export class TextControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label}>
          {label}
        </label>
        <input value={data}
               onInput={ev => this.updateData(ev.target.value)}
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
  textControlTester,
  connect(mapStateToControlProps)(TextControl)
);
