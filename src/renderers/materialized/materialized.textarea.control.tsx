import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textAreaControlTester } from '../controls/textarea.control';

export class TextAreaControl extends Control<ControlProps, void> {

  render() {

    const { data, classNames, id, visible, enabled, errors, label } = this.props;

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
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
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, textAreaControlTester),
  connect(mapStateToControlProps)(TextAreaControl)
);
