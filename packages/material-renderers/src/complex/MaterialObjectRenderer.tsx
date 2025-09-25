/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import {
  ControlWithDetailProps,
  findUISchema,
  Generate,
  isObjectControl,
  RankedTester,
  rankWith,
  update,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsDetailProps, withJsonFormsContext } from '@jsonforms/react';
import React, { useMemo } from 'react';
import { MaterialAdditionalPropertiesRenderer } from '../additional';

export const MaterialObjectRenderer = ({
  renderers,
  cells,
  uischemas,
  schema,
  label,
  path,
  visible,
  enabled,
  uischema,
  rootSchema,
  data,
  handleChange,
  config,
}: ControlWithDetailProps) => {
  const detailUiSchema = useMemo(
    () =>
      findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        () =>
          isEmpty(path)
            ? Generate.uiSchema(schema, 'VerticalLayout', undefined, rootSchema)
            : {
              ...Generate.uiSchema(schema, 'Group', undefined, rootSchema),
              label,
            },
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, label, uischema, rootSchema]
  ); const hasAdditionalProperties = useMemo(
    () =>
      !isEmpty(schema.patternProperties) ||
      isObject(schema.additionalProperties) ||
      schema.additionalProperties === true,
    [schema.patternProperties, schema.additionalProperties]
  );

  const showAdditionalProperties = useMemo(() => {
    // Check config option to allow additional properties even if not defined in schema
    const allowAdditionalPropertiesIfMissing = config?.allowAdditionalPropertiesIfMissing;
    return (
      hasAdditionalProperties ||
      (allowAdditionalPropertiesIfMissing === true &&
        schema.additionalProperties === undefined)
    );
  }, [hasAdditionalProperties, config, schema.additionalProperties]);

  if (!visible) {
    return null;
  }

  // If this object has no regular properties but has additional properties,
  // don't render anything with JsonFormsDispatch - let MaterialAdditionalPropertiesRenderer handle everything
  const shouldSkipJsonFormsDispatch = useMemo(() => {
    const regularProperties = schema.properties || {};
    const hasRegularProperties = Object.keys(regularProperties).length > 0;
    return !hasRegularProperties && hasAdditionalProperties;
  }, [schema.properties, hasAdditionalProperties]);

  // When skipping JsonFormsDispatch, use the object's title for additional properties
  const additionalPropertiesTitle = useMemo(() => {
    if (shouldSkipJsonFormsDispatch && schema.title) {
      // When skipping JsonFormsDispatch, use the object's title for the additional properties container
      return schema.title;
    }
    return undefined;
  }, [schema, shouldSkipJsonFormsDispatch]);

  // Create a filtered UI schema that excludes properties matching pattern properties
  const filteredUiSchema = useMemo(() => {
    if (shouldSkipJsonFormsDispatch || !schema.patternProperties || !data) {
      return detailUiSchema;
    }

    // Get existing data property names that match pattern properties
    const dataKeys = Object.keys(data);
    const patternMatchedKeys = dataKeys.filter(key => {
      return Object.keys(schema.patternProperties!).some(pattern =>
        new RegExp(pattern).test(key)
      );
    });

    // If no pattern matches, use original UI schema
    if (patternMatchedKeys.length === 0) {
      return detailUiSchema;
    }

    // Filter out controls for pattern-matched properties from UI schema
    if (detailUiSchema.type === 'VerticalLayout' || detailUiSchema.type === 'Group') {
      const layout = detailUiSchema as any;
      return {
        ...detailUiSchema,
        elements: (layout.elements || []).filter((element: any) => {
          if (element.type === 'Control' && element.scope) {
            const propertyName = element.scope.replace('#/properties/', '');
            return !patternMatchedKeys.includes(propertyName);
          }
          return true;
        })
      };
    }

    return detailUiSchema;
  }, [detailUiSchema, shouldSkipJsonFormsDispatch, schema.patternProperties, data]);

  return (
    <div>
      {!shouldSkipJsonFormsDispatch && (
        <JsonFormsDispatch
          visible={visible}
          enabled={enabled}
          schema={schema}
          uischema={filteredUiSchema}
          path={path}
          renderers={renderers}
          cells={cells}
        />
      )}
      {showAdditionalProperties && (
        <MaterialAdditionalPropertiesRenderer
          schema={schema}
          rootSchema={rootSchema}
          path={path}
          data={data}
          handleChange={handleChange}
          enabled={enabled}
          visible={visible}
          renderers={renderers}
          cells={cells}
          config={config}
          label={label}
          uischema={uischema}
          containerTitle={additionalPropertiesTitle}
        />
      )}
    </div>
  );
};

export const materialObjectControlTester: RankedTester = rankWith(
  2,
  isObjectControl
);

const MaterialObjectRendererWithProps = withJsonFormsDetailProps(MaterialObjectRenderer);

// Create a wrapper that adds the dispatch props
const MaterialObjectRendererWithDispatch = withJsonFormsContext(({ ctx, props }: any) => {
  const dispatchProps = {
    handleChange: (path: string, value: any) => {
      ctx.dispatch(update(path, () => value));
    },
  };

  return React.createElement(MaterialObjectRendererWithProps, { ...props, ...dispatchProps });
}); export default MaterialObjectRendererWithDispatch;