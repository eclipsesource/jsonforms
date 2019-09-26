import React, { useEffect, useState } from 'react';
import { JsonSchema } from '@jsonforms/core';

export const ResolveRef = ({
  schema,
  pointer,
  children,
  refResolver,
}: any) => {
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
      <ResolveRef schema={schema} pointer={pointer} refResolver={refResolver}>
        {(resolved: JsonSchema) => children(resolved)}
      </ResolveRef>
    );
  } else {
    return children(currentSchema);
  }
};
