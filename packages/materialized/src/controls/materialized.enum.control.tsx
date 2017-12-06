import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  ControlElement,
  rankWith,
  isEnumControl,
  mapStateToControlProps,
  registerStartupRenderer,
  resolveSchema,
  withIncreasedRank
} from 'jsonforms-core';
import { connect } from 'react-redux';
declare let $;

export class MaterializedEnumControl extends Control<ControlProps, ControlState> {

  componentDidMount() {
    $('select').material_select();
  }

  componentDidUpdate() {
    $('select').material_select();
  }

  render() {
    const {
      uischema,
      schema,
      classNames,
      id,
      label,
      visible,
      enabled,
      data,
      errors
    } = this.props;
    const options = resolveSchema(
      schema,
      (uischema as ControlElement).scope.$ref
    ).enum;

    return (
      <div className={classNames.wrapper} hidden={!visible}>
        <select
          className={classNames.input}
          disabled={!enabled}
          value={this.state.value || ''}
          onChange={ev => this.handleChange(ev.target.value) }
        >
          {
            [<option value='' key={'empty'}/>]
              .concat(
                options.map(optionValue => {
                  return (
                    <option
                      value={optionValue}
                      label={optionValue}
                      key={optionValue}
                    >
                      {optionValue}
                    </option>
                  );
                })
            )
          }
        </select>
        <label htmlFor={id} data-error={errors}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  rankWith(2, isEnumControl),
  connect(mapStateToControlProps)(MaterializedEnumControl)
);
