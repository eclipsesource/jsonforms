import * as React from 'react';
import { Category, DispatchRenderer, JsonSchema } from '@jsonforms/core';

export interface CategoryProps {
  category: Category;
  schema: JsonSchema;
  path: string;
}

export const SingleCategory = ({ category, schema, path }: CategoryProps) => (
  // TODO: add selected style
  <div id='categorization.detail'>
    {
      (category.elements || []).map((child, index) =>
        (
          <DispatchRenderer
            key={path + index.toString()}
            uischema={child}
            schema={schema}
            path={path}
          />
        )
      )
    }
  </div>
);
