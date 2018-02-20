import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { UnknownRenderer } from './UnknownRenderer';
import { DispatchFieldProps, mapStateToDispatchFieldProps } from '@jsonforms/core';
/**
 * Props of the {@link DispatchField} renderer.
 */
  /**
   * The available field renderers.
   */

const Dispatch = (dispatchFieldProps: DispatchFieldProps) => {
  const uischema = dispatchFieldProps.uischema;
  const schema = dispatchFieldProps.schema;
  const field = _.maxBy(dispatchFieldProps.fields, r => r.tester(uischema, schema));

  if (field === undefined || field.tester(uischema, schema) === -1) {
    return <UnknownRenderer type={'field'}/>;
  } else {
    const Field = field.field;

    return (
      <Field
        schema={schema}
        uischema={uischema}
        path={dispatchFieldProps.path}
      />
    );
  }
};

export const DispatchField = connect(mapStateToDispatchFieldProps)(Dispatch);
