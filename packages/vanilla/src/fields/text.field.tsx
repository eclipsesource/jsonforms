import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  ControlElement,
  FieldProps,
  handleChange,
  isStringControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

const TextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope.$ref).maxLength;

  return <input type='text'
       value={data || ''}
       onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
         handleChange(props, ev.currentTarget.value)
       }
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
       maxLength={uischema.options && uischema.options.restrict ? maxLength : undefined}
       size={uischema.options && uischema.options.trim ? maxLength : undefined}
     />;
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isStringControl);

export default registerStartupInput(
  textFieldTester,
  connect(mapStateToInputProps)(TextField)
);
