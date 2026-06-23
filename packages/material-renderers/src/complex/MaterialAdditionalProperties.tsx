/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
import React, { useMemo, useState } from 'react';
import {
  composePaths,
  ControlElement,
  createControlElement,
  createDefaultValue,
  Generate,
  GroupLayout,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  JsonSchema7,
  resolveSchema,
  UISchemaElement,
} from '@jsonforms/core';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import merge from 'lodash/merge';
import startCase from 'lodash/startCase';
import { useInputVariant } from '../util';
import { DynamicPropertyDispatch } from './DynamicPropertyDispatch';

interface AdditionalPropertyItem {
  propertyName: string;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

export interface MaterialAdditionalPropertiesProps {
  cells?: JsonFormsCellRendererRegistryEntry[];
  config?: any;
  data: any;
  enabled: boolean;
  handleChange(path: string, value: any): void;
  label: string;
  path: string;
  readonly?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  rootSchema: JsonSchema;
  schema: JsonSchema;
  uischema: ControlElement;
  uischemas?: JsonFormsUISchemaRegistryEntry[];
}

const ANY_TYPE: JsonSchema7['type'] = [
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
];

const toObjectSchema = (schema: JsonSchema): JsonSchema7 =>
  typeof schema === 'object' ? (schema as JsonSchema7) : {};

const hasAdditionalProperties = (schema: JsonSchema): boolean => {
  const objectSchema = toObjectSchema(schema);
  return (
    Boolean(
      objectSchema.patternProperties &&
        Object.keys(objectSchema.patternProperties).length > 0
    ) ||
    typeof objectSchema.additionalProperties === 'object' ||
    objectSchema.additionalProperties === true
  );
};

const getMatchingAdditionalPropertySchema = (
  propName: string,
  parentSchema: JsonSchema,
  rootSchema: JsonSchema
): JsonSchema => {
  const objectSchema = toObjectSchema(parentSchema);
  let propSchema: JsonSchema | undefined;

  if (objectSchema.patternProperties) {
    const matchedPattern = Object.keys(objectSchema.patternProperties).find(
      (pattern) => new RegExp(pattern).test(propName)
    );
    if (matchedPattern) {
      propSchema = objectSchema.patternProperties[matchedPattern];
    }
  }

  if (
    (!propSchema && typeof objectSchema.additionalProperties === 'object') ||
    objectSchema.additionalProperties === true
  ) {
    propSchema =
      objectSchema.additionalProperties === true
        ? { additionalProperties: true }
        : objectSchema.additionalProperties;
  }

  if (typeof propSchema === 'object' && typeof propSchema.$ref === 'string') {
    propSchema = resolveSchema(rootSchema, propSchema.$ref, rootSchema);
  }

  propSchema = propSchema ?? {};

  if (typeof propSchema === 'object' && propSchema.type === undefined) {
    propSchema = {
      ...propSchema,
      type: ANY_TYPE,
    };
  }

  return propSchema;
};

const toAdditionalPropertyItem = (
  propName: string,
  parentPath: string,
  parentSchema: JsonSchema,
  rootSchema: JsonSchema
): AdditionalPropertyItem => {
  let propSchema = getMatchingAdditionalPropertySchema(
    propName,
    parentSchema,
    rootSchema
  );
  let propUiSchema: UISchemaElement = createControlElement('#');

  if (typeof propSchema === 'object' && propSchema.type === 'array') {
    propUiSchema = Generate.uiSchema(
      propSchema,
      'Group',
      undefined,
      rootSchema
    );
    (propUiSchema as GroupLayout).label =
      propSchema.title ?? startCase(propName);
  }

  if (typeof propSchema === 'object') {
    propSchema = {
      ...propSchema,
      title: propName,
    };
    if (propSchema.type === 'object') {
      propSchema.additionalProperties =
        propSchema.additionalProperties !== false
          ? propSchema.additionalProperties ?? true
          : false;
    } else if (propSchema.type === 'array') {
      propSchema.items = propSchema.items ?? {};
    }
  }

  return {
    propertyName: propName,
    path: composePaths(parentPath, propName),
    schema: propSchema,
    uischema: propUiSchema,
  };
};

const getPropertyNamePattern = (schema: JsonSchema): string | undefined => {
  const objectSchema = toObjectSchema(schema);
  const propertyNames = objectSchema.propertyNames as JsonSchema7 | undefined;
  if (typeof propertyNames === 'object' && propertyNames.pattern) {
    return propertyNames.pattern;
  }

  if (
    objectSchema.additionalProperties === false &&
    objectSchema.patternProperties
  ) {
    const patterns = Object.keys(objectSchema.patternProperties);
    return patterns.length > 0 ? patterns.join('|') : undefined;
  }

  return undefined;
};

const validatePropertyName = (
  propertyName: string,
  data: any,
  schema: JsonSchema,
  currentPropertyName?: string
): string | undefined => {
  if (!propertyName) {
    return undefined;
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, propertyName)
  ) {
    if (propertyName === currentPropertyName) {
      return undefined;
    }
    return `Property '${propertyName}' already defined`;
  }

  if (
    propertyName.includes('[') ||
    propertyName.includes(']') ||
    propertyName.includes('.')
  ) {
    return `Property name '${propertyName}' is invalid`;
  }

  const pattern = getPropertyNamePattern(schema);
  if (pattern && !new RegExp(pattern).test(propertyName)) {
    return `Property name must match pattern: ${pattern}`;
  }

  return undefined;
};

export const MaterialAdditionalProperties = ({
  cells,
  config,
  data,
  enabled,
  handleChange,
  label,
  path,
  readonly,
  renderers,
  rootSchema,
  schema,
  uischema,
}: MaterialAdditionalPropertiesProps) => {
  const [newPropertyName, setNewPropertyName] = useState('');
  const [renamingPropertyName, setRenamingPropertyName] = useState<
    string | null
  >(null);
  const [renameAnchorEl, setRenameAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [renameValue, setRenameValue] = useState('');
  const inputVariant = useInputVariant();
  const appliedOptions = merge({}, config, uischema.options);
  const objectSchema = toObjectSchema(schema);
  const reservedPropertyNames = Object.keys(objectSchema.properties ?? {});
  const additionalKeys = Object.keys(data ?? {}).filter(
    (key) => !reservedPropertyNames.includes(key)
  );
  const additionalPropertyItems = useMemo(
    () =>
      additionalKeys.map((propertyName) =>
        toAdditionalPropertyItem(propertyName, path, schema, rootSchema)
      ),
    [additionalKeys.join('\u0000'), path, rootSchema, schema]
  );
  const allowIfMissing =
    appliedOptions.allowAdditionalPropertiesIfMissing === true &&
    objectSchema.additionalProperties === undefined;
  const shouldShow =
    hasAdditionalProperties(schema) ||
    allowIfMissing ||
    additionalKeys.length > 0;

  if (!shouldShow) {
    return null;
  }

  const propertyNameError = validatePropertyName(newPropertyName, data, schema);
  const maxPropertiesReached =
    objectSchema.maxProperties !== undefined &&
    data &&
    Object.keys(data).length >= objectSchema.maxProperties;
  const minPropertiesReached =
    objectSchema.minProperties !== undefined &&
    data &&
    Object.keys(data).length <= objectSchema.minProperties;
  const addPropertyDisabled =
    !enabled ||
    readonly ||
    (appliedOptions.restrict && maxPropertiesReached) ||
    Boolean(propertyNameError) ||
    !newPropertyName;
  const removePropertyDisabled =
    !enabled || readonly || (appliedOptions.restrict && minPropertiesReached);
  const additionalPropertiesTitle = toObjectSchema(
    objectSchema.additionalProperties as JsonSchema
  ).title;

  const addProperty = () => {
    if (addPropertyDisabled) {
      return;
    }

    const additionalProperty = toAdditionalPropertyItem(
      newPropertyName,
      path,
      schema,
      rootSchema
    );
    const updatedData =
      typeof data === 'object' && data !== null && !Array.isArray(data)
        ? { ...data }
        : {};

    updatedData[newPropertyName] = createDefaultValue(
      additionalProperty.schema,
      rootSchema
    );
    handleChange(path, updatedData);
    setNewPropertyName('');
  };

  const removeProperty = (propertyName: string) => {
    if (removePropertyDisabled || typeof data !== 'object' || data === null) {
      return;
    }

    const updatedData = { ...data };
    delete updatedData[propertyName];
    handleChange(path, updatedData);
  };
  const renameProperty = (propertyName: string) => {
    const trimmed = renameValue.trim();
    const renameError = validatePropertyName(
      trimmed,
      data,
      schema,
      propertyName
    );
    if (
      renameError ||
      !trimmed ||
      trimmed === propertyName ||
      typeof data !== 'object' ||
      data === null ||
      Array.isArray(data)
    ) {
      return;
    }

    const updatedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key === propertyName ? trimmed : key,
        value,
      ])
    );
    handleChange(path, updatedData);
    setRenamingPropertyName(null);
    setRenameAnchorEl(null);
    setRenameValue('');
  };
  const cancelRename = () => {
    setRenamingPropertyName(null);
    setRenameAnchorEl(null);
    setRenameValue('');
  };
  const startRename = (propertyName: string, anchorEl: HTMLElement | null) => {
    setRenamingPropertyName(propertyName);
    setRenameAnchorEl(anchorEl);
    setRenameValue(propertyName);
  };

  return (
    <Box
      sx={{
        mt: 1,
      }}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'grid',
          gap: 1,
          gridTemplateColumns: additionalPropertiesTitle
            ? 'minmax(120px, auto) 1fr auto'
            : '1fr auto',
        }}
      >
        {additionalPropertiesTitle ? (
          <Typography sx={{ pt: 1 }} variant='body2'>
            {additionalPropertiesTitle}
          </Typography>
        ) : null}
        <TextField
          fullWidth
          error={Boolean(propertyNameError)}
          helperText={propertyNameError}
          label='Property Name'
          size='small'
          value={newPropertyName}
          variant={inputVariant}
          onChange={(event) => setNewPropertyName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addProperty();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Tooltip title={label ? `Add to ${label}` : 'Add'}>
                  <span>
                    <IconButton
                      aria-label={
                        label ? `Add to ${label} button` : 'Add button'
                      }
                      disabled={addPropertyDisabled}
                      edge='end'
                      size='small'
                      onClick={addProperty}
                    >
                      <Add fontSize='small' />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        {additionalPropertyItems.map((item) => {
          const isRenaming = renamingPropertyName === item.propertyName;
          const renameError = validatePropertyName(
            renameValue.trim(),
            data,
            schema,
            item.propertyName
          );
          const renameDisabled =
            !enabled ||
            readonly ||
            Boolean(renameError) ||
            !renameValue.trim() ||
            renameValue.trim() === item.propertyName;

          return (
            <Box
              key={item.propertyName}
              sx={{
                alignItems: 'flex-start',
                display: 'grid',
                gap: 1,
                gridTemplateColumns: enabled ? 'minmax(0, 1fr) auto' : '1fr',
                minWidth: 0,
                width: '100%',
                '&:hover .additional-property-actions': {
                  opacity: 1,
                },
              }}
            >
              <Box sx={{ minWidth: 0, width: '100%' }}>
                <DynamicPropertyDispatch
                  schema={item.schema}
                  uischema={item.uischema}
                  path={item.path}
                  renderers={renderers}
                  cells={cells}
                  enabled={enabled}
                  readonly={readonly}
                  rootSchema={rootSchema}
                />
              </Box>
              {enabled ? (
                <Box
                  className='additional-property-actions'
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    opacity: isRenaming ? 1 : 0.72,
                    transition: 'opacity 120ms ease',
                  }}
                >
                  <Tooltip title='Rename'>
                    <span>
                      <IconButton
                        aria-label='Rename property button'
                        disabled={readonly}
                        size='small'
                        sx={{
                          height: 24,
                          p: 0.25,
                          width: 24,
                          '& .MuiSvgIcon-root': {
                            fontSize: 16,
                          },
                        }}
                        onClick={(event) =>
                          startRename(item.propertyName, event.currentTarget)
                        }
                      >
                        <EditOutlined />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <span>
                      <IconButton
                        aria-label='Delete button'
                        color='error'
                        disabled={removePropertyDisabled || isRenaming}
                        size='small'
                        sx={{
                          height: 24,
                          p: 0.25,
                          width: 24,
                          '& .MuiSvgIcon-root': {
                            fontSize: 16,
                          },
                        }}
                        onClick={() => removeProperty(item.propertyName)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              ) : null}
              <Popover
                anchorEl={renameAnchorEl}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                open={isRenaming}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                onClose={cancelRename}
              >
                <Box sx={{ p: 1.5, width: 300 }}>
                  <TextField
                    autoFocus
                    error={Boolean(renameError)}
                    fullWidth
                    helperText={renameError}
                    label='Property Name'
                    size='small'
                    value={renameValue}
                    variant={inputVariant}
                    onChange={(event) => setRenameValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        renameProperty(item.propertyName);
                      } else if (event.key === 'Escape') {
                        cancelRename();
                      }
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'flex-end',
                      mt: 1,
                    }}
                  >
                    <Button
                      disabled={renameDisabled}
                      size='small'
                      onClick={() => renameProperty(item.propertyName)}
                    >
                      Rename
                    </Button>
                    <Button size='small' onClick={cancelRename}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
