import { Resolve, type JsonSchema, type JsonSchema7 } from '@jsonforms/core';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';

export type DynamicPropertyNameValidationError =
  | { reason: 'alreadyDefined' }
  | { reason: 'invalid' }
  | { reason: 'schema'; errors: ErrorObject[] };

export interface DynamicPropertyNameValidationOptions {
  propertyName: string;
  currentPropertyName?: string;
  data: unknown;
  propertyNameSchema?: JsonSchema7;
  ajv?: Ajv;
}

export const composePropertyPath = (
  parentPath: string,
  propertyName: string,
): string => (parentPath ? `${parentPath}.${propertyName}` : propertyName);

export const getAdditionalPropertyNames = (
  data: Record<string, unknown> | undefined,
  reservedPropertyNames: string[],
): string[] =>
  Object.keys(data ?? {}).filter(
    (propertyName) => !reservedPropertyNames.includes(propertyName),
  );

export const haveAdditionalPropertyNamesChanged = (
  newData: Record<string, unknown> | undefined,
  oldData: Record<string, unknown> | undefined,
  reservedPropertyNames: string[],
): boolean => {
  const newNames = getAdditionalPropertyNames(newData, reservedPropertyNames);
  const oldNames = getAdditionalPropertyNames(oldData, reservedPropertyNames);
  return (
    newNames.length !== oldNames.length ||
    newNames.some((propertyName, index) => propertyName !== oldNames[index])
  );
};

export const findPropertySchema = (
  parentSchema: JsonSchema,
  propertyName: string,
  rootSchema: JsonSchema,
): JsonSchema | undefined => {
  const declaredSchema = parentSchema.properties?.[propertyName];
  if (declaredSchema) {
    return typeof declaredSchema.$ref === 'string'
      ? (Resolve.schema(rootSchema, declaredSchema.$ref, rootSchema) ??
          declaredSchema)
      : declaredSchema;
  }

  const pattern = Object.keys(parentSchema.patternProperties ?? {}).find(
    (candidate) => new RegExp(candidate).test(propertyName),
  );
  if (pattern) {
    const patternSchema = parentSchema.patternProperties?.[pattern];
    return typeof patternSchema?.$ref === 'string'
      ? (Resolve.schema(rootSchema, patternSchema.$ref, rootSchema) ??
          patternSchema)
      : patternSchema;
  }

  const additionalProperties = parentSchema.additionalProperties;
  if (typeof additionalProperties === 'object') {
    return typeof additionalProperties.$ref === 'string'
      ? (Resolve.schema(rootSchema, additionalProperties.$ref, rootSchema) ??
          additionalProperties)
      : additionalProperties;
  }

  return additionalProperties === true
    ? { additionalProperties: true }
    : undefined;
};

export const getPropertyNameSchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema7 => {
  const result: JsonSchema7 = { type: 'string' };
  const propertyNames = (schema as JsonSchema & { propertyNames?: JsonSchema })
    .propertyNames;

  if (propertyNames && typeof propertyNames === 'object') {
    const resolved =
      typeof propertyNames.$ref === 'string'
        ? (Resolve.schema(rootSchema, propertyNames.$ref, rootSchema) ??
          propertyNames)
        : propertyNames;
    return { ...resolved, ...result } as JsonSchema7;
  }

  if (
    schema.additionalProperties === false &&
    schema.patternProperties &&
    typeof schema.patternProperties === 'object'
  ) {
    const patterns = Object.keys(schema.patternProperties);
    if (patterns.length > 0) {
      return { pattern: patterns.join('|'), ...result };
    }
  }

  return result;
};

export const validateDynamicPropertyName = ({
  propertyName,
  currentPropertyName,
  data,
  propertyNameSchema,
  ajv,
}: DynamicPropertyNameValidationOptions): DynamicPropertyNameValidationError | null => {
  if (!propertyName) {
    return null;
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, propertyName) &&
    propertyName !== currentPropertyName
  ) {
    return { reason: 'alreadyDefined' };
  }

  // JSON Forms data paths use dots as segment separators. Brackets are
  // treated literally by core and therefore are valid in property names.
  if (propertyName.includes('.')) {
    return { reason: 'invalid' };
  }

  if (
    propertyNameSchema &&
    ajv &&
    !ajv.validate(propertyNameSchema, propertyName)
  ) {
    return { reason: 'schema', errors: [...(ajv.errors ?? [])] };
  }

  return null;
};

export const getDynamicPropertyNameErrorMessage = (
  error: DynamicPropertyNameValidationError | null,
  messages: {
    alreadyDefined: string;
    invalid: string;
    schema?: (error: ErrorObject) => string;
  },
): string | null => {
  if (!error) {
    return null;
  }
  if (error.reason === 'alreadyDefined') {
    return messages.alreadyDefined;
  }
  if (error.reason === 'invalid') {
    return messages.invalid;
  }
  const translatedErrors = error.errors
    .map((schemaError) =>
      messages.schema
        ? messages.schema(schemaError)
        : (schemaError.message ?? ''),
    )
    .filter(Boolean);
  return translatedErrors.join(', ') || messages.invalid;
};
