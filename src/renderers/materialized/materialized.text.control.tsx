import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textControlTester } from '../controls/text.control';
import { connect, Event } from '../../common/binding';

export class MaterializedTextControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;

    return (
      <div className={classNames.wrapper}>
        <input value={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) =>
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
  withIncreasedRank(1, textControlTester),
  connect(mapStateToControlProps)(MaterializedTextControl)
);
