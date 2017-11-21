import { JSX } from '../JSX';
import * as _ from 'lodash';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { numberControlTester } from '../controls/number.control';
import { connect, Event } from '../../common/binding';

export class NumberControl extends Control<ControlProps, ControlState> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label, uischema,
      required } = this.props;

    return (
      <div className={classNames.wrapper}>
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {required ? label + '*' : label}
        </label>
        <input type='number'
               step='0.1'
               value={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) =>
                 this.handleChange(_.toNumber(ev.currentTarget.value))
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
  withIncreasedRank(1, numberControlTester),
  connect(mapStateToControlProps)(NumberControl)
);
