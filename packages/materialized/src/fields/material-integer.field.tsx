import * as React from 'react';
import {
  and,
  FieldProps,
  handleChange,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  schemaTypeIs,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialIntegerField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <Input type='number'
    value={data || ''}
    onChange={ ev => handleChange(props, parseInt(ev.target.value, 10))}
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
  />;
};
export const integerFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaTypeIs('integer')
));
export default registerStartupInput(
    integerFieldTester,
    connect(mapStateToInputProps)(MaterialIntegerField)
);
