import * as React from 'react';
import {
  and,
  boundSchemaMatches,
  boundSchemaTypeIs,
  ControlElement,
  FieldProps,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  or,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema,
  uiTypeIs
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

const MaterialSliderField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
  const controlElement = uischema as ControlElement;
  const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
  const config = {'max': resolvedSchema.maximum, 'min': resolvedSchema.minimum};

  return (
    <Input
      type='range'
      value={data || ''}
      onChange={ev => handleChange(path, Number(ev.currentTarget.value))}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      inputProps={config}
    />
  );
};

/**
 * Matrial tester for slider controls.
 * @type {RankedTester}
 */
export const sliderFieldTester: RankedTester = rankWith(4, and(
     uiTypeIs('Control'),
     or(boundSchemaTypeIs('number'), boundSchemaTypeIs('integer')),
     boundSchemaMatches(schema =>
       schema.hasOwnProperty('maximum') && schema.hasOwnProperty('minimum')
     )
 ));

export default registerStartupInput(
  sliderFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialSliderField)
);
