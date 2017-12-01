import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  isBooleanControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer,
  withIncreasedRank
} from 'jsonforms-core';
import { connect } from 'react-redux';

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
  rankWith(2, isBooleanControl),
  connect(mapStateToControlProps)(BooleanControl)
);
