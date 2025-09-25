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
import {
  composePaths,
  createControlElement,
  createDefaultValue,
  Generate,
  JsonSchema,
  JsonSchema7,
  Resolve,
  UISchemaElement,
} from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import startCase from 'lodash/startCase';
import React, { useCallback, useMemo, useState } from 'react';

interface AdditionalPropertyType {
  propertyName: string;
  path: string;
  schema: JsonSchema | undefined;
  uischema: UISchemaElement | undefined;
}

export interface MaterialAdditionalPropertiesRendererProps {
  schema: JsonSchema;
  rootSchema: JsonSchema;
  path: string;
  data: any;
  handleChange: (path: string, value: any) => void;
  enabled: boolean;
  visible: boolean;
  renderers: any[];
  cells: any[];
  config?: any;
  label?: string;
  uischema: UISchemaElement;
  containerTitle?: string;
}

export const MaterialAdditionalPropertiesRenderer = ({
  data,
  path,
  schema,
  rootSchema,
  handleChange,
  enabled,
  visible,
  renderers,
  cells,
  containerTitle,
}: MaterialAdditionalPropertiesRendererProps) => {
  const [newPropertyName, setNewPropertyName] = useState<string>('');
  const [newPropertyErrors, setNewPropertyErrors] = useState<string[]>([]);

  const reservedPropertyNames = useMemo(
    () => Object.keys(schema.properties || {}),
    [schema.properties]
  );

  const additionalKeys = useMemo(
    () =>
      Object.keys(data || {}).filter(
        (k) => !reservedPropertyNames.includes(k)
      ),
    [data, reservedPropertyNames]
  );

  const toAdditionalPropertyType = useCallback(
    (
      propName: string,
      parentSchema: JsonSchema,
      rootSchemaRef: JsonSchema
    ): AdditionalPropertyType => {
      let propSchema: JsonSchema | undefined = undefined;
      let propUiSchema: UISchemaElement | undefined = undefined;

      // Check pattern properties first
      if (parentSchema.patternProperties) {
        const matchedPattern = Object.keys(parentSchema.patternProperties).find(
          (pattern) => new RegExp(pattern).test(propName)
        );
        if (matchedPattern) {
          propSchema = parentSchema.patternProperties[matchedPattern];
        }
      }

      // Check additional properties
      if (
        (!propSchema &&
          typeof parentSchema.additionalProperties === 'object') ||
        parentSchema.additionalProperties === true
      ) {
        propSchema =
          parentSchema.additionalProperties === true
            ? { additionalProperties: true }
            : parentSchema.additionalProperties;
      }

      // Resolve $ref if present
      if (typeof propSchema?.$ref === 'string') {
        propSchema = Resolve.schema(propSchema, propSchema.$ref, rootSchemaRef);
      }

      propSchema = propSchema ?? {};

      // Set default type if not specified
      if (propSchema.type === undefined) {
        propSchema = {
          ...propSchema,
          type: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ] as any,
        };
      }

      // Generate UI schema
      if (propSchema.type === 'array') {
        propUiSchema = Generate.uiSchema(
          propSchema,
          'Group',
          undefined,
          rootSchemaRef
        );
        if (propUiSchema.type !== 'Label') {
          const titleToUse = propSchema.title ?? startCase(propName);
          (propUiSchema as any).label = titleToUse;
        }
      } else if (propSchema.type === 'object') {
        propUiSchema = Generate.uiSchema(
          propSchema,
          'Group',
          undefined,
          rootSchemaRef
        );
        if (propUiSchema.type !== 'Label') {
          const titleToUse = propSchema.title ?? startCase(propName);
          (propUiSchema as any).label = titleToUse;
        }
      } else {
        propUiSchema = createControlElement('#');
      }

      // Set up schema with title (always use property name for objects with additional properties)
      propSchema = {
        ...propSchema,
        title: propName,
      };

      if (propSchema.type === 'object') {
        propSchema.additionalProperties =
          propSchema.additionalProperties !== false
            ? (propSchema.additionalProperties ?? true)
            : false;
      } else if (propSchema.type === 'array') {
        propSchema.items = propSchema.items ?? {};
        // For arrays, ensure items schema doesn't have a generic title
        if (typeof propSchema.items === 'object' && !Array.isArray(propSchema.items) && (propSchema.items as any).title) {
          propSchema.items = {
            ...propSchema.items,
            title: undefined
          };
        }
      } const result = {
        propertyName: propName,
        path: composePaths(path, propName),
        schema: propSchema,
        uischema: propUiSchema,
      };

      return result;
    },
    [path]
  );

  const additionalPropertyItems = useMemo(
    () => {
      const items = additionalKeys.map((propName) =>
        toAdditionalPropertyType(propName, schema, rootSchema)
      );
      console.log('additionalPropertyItems:', { path, additionalKeys, items });
      return items;
    },
    [additionalKeys, data, schema, rootSchema, toAdditionalPropertyType, path]
  );

  const validatePropertyName = useCallback(
    (propertyName: string): string[] => {
      const errors: string[] = [];

      if (!propertyName.trim()) {
        errors.push('Property name is required');
        return errors;
      }

      // Check if property already exists
      if (data && Object.keys(data).includes(propertyName)) {
        errors.push(`Property "${propertyName}" already exists`);
      }

      // Check for invalid characters (JSONForms path composition uses these)
      if (
        propertyName.includes('[') ||
        propertyName.includes(']') ||
        propertyName.includes('.')
      ) {
        errors.push('Property name cannot contain "[", "]", or "."');
      }

      return errors;
    },
    [data]
  );

  const handlePropertyNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setNewPropertyName(value);
      setNewPropertyErrors(validatePropertyName(value));
    },
    [validatePropertyName]
  );

  const addProperty = useCallback(() => {
    if (!newPropertyName.trim() || newPropertyErrors.length > 0) {
      return;
    }

    const additionalProperty = toAdditionalPropertyType(
      newPropertyName,
      schema,
      rootSchema
    );

    if (additionalProperty.schema) {
      const updatedData = { ...data };
      updatedData[newPropertyName] = createDefaultValue(
        additionalProperty.schema,
        rootSchema
      );
      handleChange(path, updatedData);
    }

    setNewPropertyName('');
    setNewPropertyErrors([]);
  }, [
    newPropertyName,
    newPropertyErrors,
    toAdditionalPropertyType,
    schema,
    rootSchema,
    data,
    handleChange,
    path,
  ]);

  const removeProperty = useCallback(
    (propName: string) => {
      if (data) {
        const updatedData = { ...data };
        delete updatedData[propName];
        handleChange(path, updatedData);
      }
    },
    [data, handleChange, path]
  );

  const addPropertyDisabled = useMemo(() => {
    if (!enabled) return true;
    if (!newPropertyName.trim()) return true;
    if (newPropertyErrors.length > 0) return true;

    // Check maxProperties constraint
    if (
      schema.maxProperties !== undefined &&
      data &&
      Object.keys(data).length >= schema.maxProperties
    ) {
      return true;
    }

    return false;
  }, [enabled, newPropertyName, newPropertyErrors, schema.maxProperties, data]);

  const removePropertyDisabled = useMemo(() => {
    if (!enabled) return true;

    // Check minProperties constraint
    if (
      schema.minProperties !== undefined &&
      data &&
      Object.keys(data).length <= schema.minProperties
    ) {
      return true;
    }

    return false;
  }, [enabled, schema.minProperties, data]);

  const additionalPropertiesTitle = useMemo(() => {
    // Use containerTitle prop if provided
    if (containerTitle) {
      return containerTitle;
    }

    // Check if the current property (from path) matches a pattern property
    // Extract the property name from the path (e.g., "/arrayOfValuesByKey" -> "arrayOfValuesByKey")
    const pathSegments = path.split('/').filter(Boolean);
    const currentPropertyName = pathSegments[pathSegments.length - 1];

    if (currentPropertyName && schema.patternProperties) {
      const matchedPattern = Object.keys(schema.patternProperties).find(
        (pattern) => new RegExp(pattern).test(currentPropertyName)
      );
      if (matchedPattern) {
        const patternSchema = schema.patternProperties[matchedPattern];
        if (patternSchema && typeof patternSchema === 'object' && patternSchema.title) {
          return patternSchema.title;
        }
      }
    }

    // Fall back to schema.additionalProperties.title
    const title = (schema.additionalProperties as JsonSchema7)?.title;
    return title || undefined;
  }, [containerTitle, schema.patternProperties, schema.additionalProperties, path]);

  if (!visible) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        {additionalPropertiesTitle && (
          <Typography variant="h6" gutterBottom>
            {additionalPropertiesTitle}
          </Typography>
        )}

        {/* Add new property section */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 'grow' }}>
              <TextField
                fullWidth
                label="Property Name"
                value={newPropertyName}
                onChange={handlePropertyNameChange}
                disabled={!enabled}
                error={newPropertyErrors.length > 0}
                helperText={newPropertyErrors.join(', ')}
                size="small"
              />
            </Grid>
            <Grid>
              <Tooltip title="Add Property">
                <span>
                  <IconButton
                    onClick={addProperty}
                    disabled={addPropertyDisabled}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {/* Existing additional properties */}
        {additionalPropertyItems.map((item) => (
          <Box key={item.propertyName} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 'grow' }}>
                {item.schema && item.uischema && (
                  <>
                    {/* For objects with additionalProperties, render directly with MaterialAdditionalPropertiesRenderer */}
                    {item.schema.type === 'object' && item.schema.additionalProperties ? (
                      <MaterialAdditionalPropertiesRenderer
                        schema={item.schema}
                        rootSchema={rootSchema}
                        path={item.path}
                        data={data ? data[item.propertyName] : undefined}
                        handleChange={handleChange}
                        enabled={enabled}
                        visible={visible}
                        renderers={renderers}
                        cells={cells}
                        uischema={item.uischema}
                        containerTitle={item.propertyName}
                      />
                    ) : (
                      <JsonFormsDispatch
                        schema={item.schema}
                        uischema={item.uischema}
                        path={item.path}
                        enabled={enabled}
                        renderers={renderers}
                        cells={cells}
                      />
                    )}
                  </>
                )}
              </Grid>
              {enabled && (
                <Grid>
                  <Tooltip title="Remove Property">
                    <span>
                      <IconButton
                        onClick={() => removeProperty(item.propertyName)}
                        disabled={removePropertyDisabled}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}

        {additionalPropertyItems.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No additional properties defined
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialAdditionalPropertiesRenderer;