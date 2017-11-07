import { JSX } from '../JSX';
import * as _ from 'lodash';
import { withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { integerControlTester } from '../controls/integer.control';

export class IntegerControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='number'
               step='1'
               value={data}
               onInput={ev => this.updateData(_.toInteger(ev.target.value))}
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
  withIncreasedRank(1, integerControlTester),
  connect(mapStateToControlProps)(IntegerControl)
);
