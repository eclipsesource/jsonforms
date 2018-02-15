import * as React from 'react';
import {
  computeLabel,
  connectToJsonForms,
  Control,
  ControlProps,
  ControlState,
  isDateTimeControl,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { DateTimePicker } from 'material-ui-pickers';
import * as moment from 'moment';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';

export class MaterialDateTimeControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      description,
      errors,
      label,
      uischema,
      visible,
      enabled,
      required,
      path,
      handleChange,
      data
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    const inputProps = {};

    return (
      <DateTimePicker
        id={id}
        label={computeLabel(label, required)}
        error={!isValid}
        style={style}
        fullWidth={!trim}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        helperText={!isValid ? errors : description}
        InputLabelProps={{shrink: true, }}
        value={data || null}
        onChange={ datetime => 
          handleChange(path, datetime ? moment(datetime).format() : '')
        }
        format='MM/DD/YYYY h:mm a'
        clearable={true}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        leftArrowIcon={<KeyboardArrowLeftIcon />}
        rightArrowIcon={<KeyboardArrowRightIcon />}
        dateRangeIcon={<DateRangeIcon />}
        timeIcon={<AccessTimeIcon />}
        onClear={() =>
          handleChange(path, '')
        }
        InputProps={inputProps}
      />
    );
  }
}
export const materialDateTimeControlTester: RankedTester = rankWith(2, isDateTimeControl);
export default connectToJsonForms(
  mapStateToControlProps, mapDispatchToControlProps
)(MaterialDateTimeControl);
