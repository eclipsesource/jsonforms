import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { booleanControlTester } from '../controls/boolean.control';
import { connect, Event } from '../../common/binding';

export class BooleanControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    const className = classNames.wrapper.replace('input-field', '');

    return (
      <div className={className}>
        <input type='checkbox'
               checked={this.state.value || ''}
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
        />
        <label htmlFor={id} className={classNames.label} data-error={errors}
          onClick={() => this.handleChange(!this.state.value)}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, booleanControlTester),
  connect(mapStateToControlProps)(BooleanControl)
);
