import * as React from 'react';
import * as _ from 'lodash';
import { DispatchRenderer, JsonSchema, Layout } from '@jsonforms/core';

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
        <DispatchRenderer
          uischema={child}
          schema={schema}
          path={path}
        />
      </div>
    );
  });
};
