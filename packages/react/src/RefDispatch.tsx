import React, { useEffect, useState } from 'react';
import { JsonFormsDispatch } from './JsonForms';
import { JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';
import { withJsonFormsProps } from './JsonFormsContext';

const isRef = (schema: JsonSchema): boolean => {
  if (schema !== undefined) {
    return schema.$ref !== undefined;
  }
  return false;
};

export const RefDispatch = ({
  schema,
  refResolver,
  ...otherProps
}: any) => {
  const [currentSchema, setSchema] = useState(undefined);

  useEffect(() => {
    setSchema(undefined);
    refResolver(schema.$ref).then((resolved: any) => {
      setSchema(resolved);
    });
  }, [schema]);

  if (schema.$ref === undefined) {
    return (
      <JsonFormsDispatch
        {...otherProps}
        schema={schema}
      />
    );
  }

  if (currentSchema === undefined) {
    return null;
  } else {
    return (
      <JsonFormsDispatch
        {...otherProps}
        schema={currentSchema}
      />
    );
  }
};

export const refDispatchTester = rankWith(5, schemaMatches(isRef));
const ConnectedRefDispatch = withJsonFormsProps(RefDispatch);
ConnectedRefDispatch.displayName = 'RefDispatch';
export { ConnectedRefDispatch };
