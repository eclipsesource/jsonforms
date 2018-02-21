import * as React from 'react';
import {
  FieldProps,
  isEnumControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

export const MaterialEnumField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange, scopedSchema } = props;
  const options = scopedSchema.enum;

  return (
    <Select
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      value={data || ''}
      onChange={ev => handleChange(path, ev.target.value)}
      fullWidth={true}
    >
      {
        [<MenuItem value='' key={'empty'} />]
          .concat(
            options.map(optionValue =>
              (
                <MenuItem value={optionValue} key={optionValue}>
                  {optionValue}
                </MenuItem>
              )
            )
          )}
    </Select>
  );
};
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const materialEnumFieldTester: RankedTester = rankWith(2, isEnumControl);
export default connectToJsonForms(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialEnumField);
