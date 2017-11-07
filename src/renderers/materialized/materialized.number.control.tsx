import { JSX } from '../JSX';
import * as _ from 'lodash';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs, withIncreasedRank } from '../../core/testers';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { numberControlTester } from '../controls/number.control';

export class NumberControl extends Control<ControlProps, void> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label } = this.props;

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <input type='number'
               step='0.1'
               value={data}
               onInput={ev => this.updateData(_.toNumber(ev.target.value))}
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
  withIncreasedRank(1, numberControlTester),
  connect(mapStateToControlProps)(NumberControl)
);
