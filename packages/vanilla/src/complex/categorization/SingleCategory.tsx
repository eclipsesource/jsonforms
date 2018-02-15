import * as React from 'react';
import { Category, JsonForms, JsonSchema } from '@jsonforms/core';

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
          <JsonForms
            key={`${path}-${index}`}
            uischema={child}
            schema={schema}
            path={path}
          />
        )
      )
    }
  </div>
);
