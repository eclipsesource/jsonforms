import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textControlTester } from '../controls/text.control';

export class TextControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;

    return (
      <div className={classNames.wrapper}>
        <input value={data}
               onInput={ev => this.updateData(ev.target.value)}
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
  withIncreasedRank(1, textControlTester),
  connect(mapStateToControlProps)(TextControl)
);
