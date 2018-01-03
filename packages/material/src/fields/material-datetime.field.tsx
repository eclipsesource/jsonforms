import * as React from 'react';
import {
  FieldProps,
  isDateTimeControl,
  mapStateToFieldProps,
  mapDispatchToFieldProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { DateTimePicker } from 'material-ui-pickers';
import * as moment from 'moment'
import 'moment/locale/de';
 
moment.locale('de');

export const MaterialDateTimeField = (props: FieldProps) => {
  const { data, id, enabled, uischema, path, handleChange } = props;

  // TODO: move this to internationalization file
  const german = {
      format: 'DD.MM.YYYY HH:mm',
      cancelLabel: 'ABBRECHEN',
      clearLabel: 'LÖSCHEN'
  };

  let inputProps = {};

  return (
      <DateTimePicker
          value={data || ''}
          onChange={ datetime => 
            handleChange(path, moment(datetime).format())
          }
          id={id}
          format={german.format}
          ampm={false}
          cancelLabel={german.cancelLabel}
          clearLabel={german.clearLabel}
          clearable={true}
          disabled={!enabled}
          autoFocus={uischema.options && uischema.options.focus}
          fullWidth={true}
          leftArrowIcon='keyboard_arrow_left'
          rightArrowIcon='keyboard_arrow_right'
          onClear={() =>
              handleChange(path, undefined)
          }
          InputProps={inputProps}
      />
  );
};
export const datetimeFieldTester: RankedTester = rankWith(2, isDateTimeControl);
export default registerStartupInput(
  datetimeFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialDateTimeField)
);