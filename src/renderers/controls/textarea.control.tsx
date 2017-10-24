import { JSX } from '../JSX';
import { and, optionIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    optionIs('multi', true)
  ));

export class TextAreaControl extends Control<ControlProps, void> {

  render() {

    const { data, classNames, id, visible, enabled, errors, label } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label}>
          {label}
        </label>
        <textarea
          value={data}
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

  /**
   * @inheritDoc
   */
  protected toInput(value: any): any {
    return (value === undefined || value === null) ? '' : value;
  }
}

export default registerStartupRenderer(
  textAreaControlTester,
  connect(mapStateToControlProps)(TextAreaControl)
);
