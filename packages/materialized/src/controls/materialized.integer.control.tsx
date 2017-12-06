import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  isIntegerControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer,
} from 'jsonforms-core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

export class MaterializedIntegerControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;

    return (
      <div className={classNames.wrapper}>
        <input type='number'
               step='1'
               value={this.state.value || ''}
               onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
                 this.handleChange(parseInt(ev.currentTarget.value, 10))
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
  rankWith(2, isIntegerControl),
  connect(mapStateToControlProps)(MaterializedIntegerControl)
);
