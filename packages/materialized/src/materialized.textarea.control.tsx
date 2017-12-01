import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  isMultiLineControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer,
} from 'jsonforms-core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

export class MaterializedTextareaControl extends Control<ControlProps, ControlState> {

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema } = this.props;
    classNames.input += ' materialize-textarea';
    
    return (
      <div className={classNames.wrapper}>
        <textarea
          value={this.state.value || ''}
          onChange={(ev: SyntheticEvent<HTMLTextAreaElement>) =>
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
  rankWith(1, isMultiLineControl),
  connect(mapStateToControlProps)(MaterializedTextareaControl)
);
