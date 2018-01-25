import * as React from 'react';
import { Category, DispatchRenderer, JsonSchema } from '@jsonforms/core';

export interface CategoryProps {
  category: Category;
  schema: JsonSchema;
  path: string;
  config: any;
}

export const SingleCategory = ({ category, schema, path, config }: CategoryProps) => (
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
            config={config}
          />
        )
      )
    }
  </div>
);
