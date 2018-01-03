import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isDateTimeControl,
  mapStateToInputProps,
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
  const { data, id, enabled, uischema } = props;

  // TODO: move this to internationalization file
  const german = {
      format: 'DD.MM.YYYY HH:mm',
      cancelLabel: 'ABBRECHEN'
  };

  return (
    <div style={{
        marginTop: '16px',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}>
      <DateTimePicker
          value={data || ''}
          onChange={ datetime =>
            handleChange(props, datetime.format())  
          }
          id={id}
          format={german.format}
          ampm={false}
          cancelLabel={german.cancelLabel}
          disabled={!enabled}
          autoFocus={uischema.options && uischema.options.focus}
          fullWidth={true}
      />
    </div>
  );
};
export const datetimeFieldTester: RankedTester = rankWith(3, isDateTimeControl);
export default registerStartupInput(
  datetimeFieldTester,
  connect(mapStateToInputProps)(MaterialDateTimeField)
);