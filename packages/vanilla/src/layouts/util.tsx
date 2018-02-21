import * as React from 'react';
import * as _ from 'lodash';
import { JsonSchema, Layout } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
export interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  className: string;
  path: string;
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  className: string,
  path: string) => {

  if (_.isEmpty(layout.elements)) {
    return [];
  }

  return layout.elements.map((child, index) => {
    return (
      <div className={className} key={`${path}-${index}`}>
        <JsonForms
          uischema={child}
          schema={schema}
          path={path}
        />
      </div>
    );
  });
};
