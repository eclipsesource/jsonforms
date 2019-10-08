import React, { useEffect, useState } from 'react';
import { JsonSchema } from '@jsonforms/core';

export interface RefResolverProps {
  schema: JsonSchema;
  pointer: string;
  children(resolvedSchema: JsonSchema): any;
  resolveRef(pointer: string): Promise<JsonSchema>;
}

export const RefResolver = ({
  schema,
  pointer,
  children,
  resolveRef: refResolver,
}: RefResolverProps) => {
  const [currentSchema, setSchema] = useState(undefined);

  useEffect(() => {
    if (pointer === undefined) {
      return;
    }
    setSchema(undefined);
    refResolver(pointer).then((resolved: any) => {
      setSchema(resolved);
    });
  }, [schema, pointer]);

  if (pointer === undefined) {
    return children(schema);
  } if (currentSchema === undefined) {
    return null;
  } else if (currentSchema.$ref) {
    return (
      <RefResolver schema={schema} pointer={pointer} resolveRef={refResolver}>
        {(resolved: JsonSchema) => children(resolved)}
      </RefResolver>
    );
  } else {
    return children(currentSchema);
  }
};
