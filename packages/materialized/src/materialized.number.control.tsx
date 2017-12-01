import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  mapStateToControlProps,
  isNumberControl,
  rankWith,
  registerStartupRenderer,
} from 'jsonforms-core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

export class NumberControl extends Control<ControlProps, ControlState> {

  render() {
    const { data, classNames, id, visible, enabled, errors, label, uischema } = this.props;

    return (
      <div className={classNames.wrapper}>
        <input type='number'
               step='0.1'
               value={this.state.value || ''}
               onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
                 this.handleChange(Number(ev.currentTarget.value))
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
  rankWith(2, isNumberControl),
  connect(mapStateToControlProps)(NumberControl)
);
