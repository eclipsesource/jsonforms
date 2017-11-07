import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { booleanControlTester } from '../controls/boolean.control';

export class BooleanControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;
    const className = classNames.wrapper.replace('input-field', '');

    return (
      <div className={className}>
        <input type='checkbox'
               checked={data}
               onClick={ev => this.updateData(ev.target.checked)}
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
        />
        <label for={id} className={classNames.label} data-error={errors}>
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
