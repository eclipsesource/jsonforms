import * as React from 'react';
import {
  and,
  ControlElement,
  FieldProps,
  handleChange,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema,
  schemaMatches,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

export const MaterialEnumField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema } = props;
  const options = resolveSchema(schema, (uischema as ControlElement).scope.$ref).enum;

  return <Select
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    value={data || ''}
    onChange={ ev => handleChange(props, ev.target.value)}
    fullWidth
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
        )
      }
  </Select>;
};
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('enum'))
));
export default registerStartupInput(
  enumFieldTester,
  connect(mapStateToInputProps)(MaterialEnumField)
);
