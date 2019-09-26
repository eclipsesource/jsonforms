import { useEffect, useState } from 'react';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface ScopedRendererProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  children(resolvedSchema: JsonSchema): any;
  refResolver(pointer: string): JsonSchema;
}

/**
 * Component for resolving the scope given by an UI schema.
 * If the UI schema does not have a scope property, it just renders the given schema.
 */
export const ScopedRenderer = ({
  schema,
  uischema,
  refResolver,
  children
}: any) => {
  const [currentSchema, setSchema] = useState(undefined);

  useEffect(() => {
    if (uischema.scope === undefined) {
      return;
    }
    setSchema(undefined);
    refResolver(uischema.scope).then((resolved: any) => {
      setSchema(resolved);
    });
  }, [schema, uischema]);

  if (uischema.scope === undefined) {
    return children(schema);
  }

  if (currentSchema === undefined) {
    return null;
  } else {
    return children(currentSchema);
  }
};
