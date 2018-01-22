import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  and,
  ControlElement,
  FieldProps,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  or,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema,
  schemaMatches,
  schemaTypeIs,
  uiTypeIs
} from '@jsonforms/core';
import { connect } from 'react-redux';

const SliderField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
  const controlElement = uischema as ControlElement;
  const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);

  return <input
    type='range'
    max={resolvedSchema.maximum}
    min={resolvedSchema.minimum}
    value={data || ''}
    onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
      handleChange(path, Number(ev.currentTarget.value))
    }
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
  />;
};

/**
 * Default tester for slider controls.
 * @type {RankedTester}
 */
export const sliderFieldTester: RankedTester = rankWith(4, and(
     uiTypeIs('Control'),
     or(schemaTypeIs('number'), schemaTypeIs('integer')),
     schemaMatches(schema =>
       schema.hasOwnProperty('maximum') && schema.hasOwnProperty('minimum')
     )
 ));

export default registerStartupInput(
  sliderFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(SliderField)
);
