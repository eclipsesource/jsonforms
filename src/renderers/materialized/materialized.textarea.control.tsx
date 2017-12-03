import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textAreaFieldTester } from '../fields/textarea.field';
import { connect, Event } from '../../common/binding';

export class MaterializedTextareaControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    classNames.input += ' materialize-textarea';

    return (
      <div className={classNames.wrapper}>
        <textarea
          value={this.state.value || ''}
          onChange={(ev: Event<HTMLTextAreaElement>) =>
            this.handleChange(ev.currentTarget.value)
          }
          className={classNames.input}
          id={id}
          hidden={!visible}
          disabled={!enabled}
          autoFocus={uischema.options && uischema.options.focus}
        />
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, textAreaFieldTester),
  connect(mapStateToControlProps)(MaterializedTextareaControl)
);
