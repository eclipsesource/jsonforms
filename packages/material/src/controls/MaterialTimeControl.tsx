import * as React from 'react';
import {
  computeLabel,
  Control,
  ControlElement,
  ControlProps,
  ControlState,
  isDescriptionHidden,
  isTimeControl,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { TimePicker } from 'material-ui-pickers';
import * as moment from 'moment';

export class MaterialTimeControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      errors,
      label,
      uischema,
      schema,
      visible,
      enabled,
      required,
      path,
      handleChange,
      data,
      locale,
      translations
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    let inputProps = {};
    const localLocale = moment().locale(locale);
    const localeDateTimeFormat = `${localLocale.localeData().longDateFormat('LT')}`;

    return (
      <TimePicker
        id={id}
        label={computeLabel(label, required)}
        error={!isValid}
        style={style}
        fullWidth={!trim}
        helperText={!isValid ? errors : showDescription ? description : null}
        InputLabelProps={{shrink: true}}
        value={data || null}
        onChange={ datetime =>
          handleChange(path, datetime ? moment(datetime).format('HH:mm') : '')
        }
        format={localeDateTimeFormat}
        clearable={true}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        onClear={() =>
          handleChange(path, '')
        }
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
        cancelLabel={translations && translations.cancelLabel ? translations.cancelLabel : 'Cancel'}
        clearLabel={translations && translations.clearLabel ? translations.clearLabel : 'Clear'}
        InputProps={inputProps}
      />
    );
  }
}

export const timeControlTester: RankedTester = rankWith(4, isTimeControl);
export default registerStartupRenderer(
  timeControlTester,
  connect(mapStateToControlProps, mapDispatchToControlProps)(MaterialTimeControl)
);