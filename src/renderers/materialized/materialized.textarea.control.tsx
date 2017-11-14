import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textAreaControlTester } from '../controls/textarea.control';
import { connect, Event } from '../../common/binding';

export class MaterializedTextareaControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
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
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, textAreaControlTester),
  connect(mapStateToControlProps)(MaterializedTextareaControl)
);
