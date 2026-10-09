import { additionalPropertySchema } from './additionalPropertySchema';
import { Resolve, type JsonSchema, type JsonSchema7 } from '@jsonforms/core';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';

export type DynamicPropertyNameValidationError =
  | { reason: 'alreadyDefined' }
  | { reason: 'invalid' }
  | { reason: 'schema'; errors: ErrorObject[] };

export interface DynamicPropertyNameValidationOptions {
  propertyName: string;
  /** Enable only when the caller updates literal keys at the parent path. */
  allowDots?: boolean;
  allowEmptyPropertyNames?: boolean;
  currentPropertyName?: string;
  data: unknown;
  /** Names owned by the object schema, even when absent from data. */
  reservedPropertyNames?: readonly string[];
  propertyNameSchema?: JsonSchema7;
  ajv?: Ajv;
}

export const composePropertyPath = (
  parentPath: string,
  propertyName: string,
): string => (parentPath ? `${parentPath}.${propertyName}` : propertyName);

export const getPathAncestorPaths = (
  rootPath: string,
  targetPath: string,
): string[] => {
  const relativePath =
    rootPath && targetPath.startsWith(`${rootPath}.`)
      ? targetPath.slice(rootPath.length + 1)
      : targetPath === rootPath
        ? ''
        : targetPath;
  const segments = relativePath.split('.').filter(Boolean);
  const ancestors = [rootPath];
  let currentPath = rootPath;

  segments.slice(0, -1).forEach((segment) => {
    currentPath = composePropertyPath(currentPath, segment);
    ancestors.push(currentPath);
  });

  return ancestors;
};

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

  return additionalPropertySchema(propertyName, parentSchema, rootSchema);
};

/** Rename preserves property count, so only name ownership and editability matter. */
export const canRenameDynamicProperty = ({
  schema,
  data,
  propertyName,
  enabled,
  readonly,
  restrict,
}: {
  schema: JsonSchema;
  data: unknown;
  propertyName: string;
  enabled: boolean;
  readonly: boolean;
  restrict?: boolean;
}): boolean =>
  enabled &&
  !readonly &&
  typeof data === 'object' &&
  data !== null &&
  !Array.isArray(data) &&
  Object.prototype.hasOwnProperty.call(data, propertyName) &&
  !Object.prototype.hasOwnProperty.call(
    schema.properties ?? {},
    propertyName,
  ) &&
  !(restrict && schema.required?.includes(propertyName));

export const getPropertyNameSchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema7 => {
  const constraints: JsonSchema7[] = [];
  const propertyNames = (
    schema as JsonSchema & { propertyNames?: JsonSchema7 | boolean }
  ).propertyNames;

  if (propertyNames === false) {
    // Express a false schema without requiring boolean-schema type support.
    constraints.push({ not: {} });
  } else if (propertyNames && typeof propertyNames === 'object') {
    const resolved =
      typeof propertyNames.$ref === 'string'
        ? (Resolve.schema(rootSchema, propertyNames.$ref, rootSchema) ??
          propertyNames)
        : propertyNames;
    constraints.push(resolved as JsonSchema7);
  }

  if (schema.additionalProperties === false) {
    const patterns = Object.keys(schema.patternProperties ?? {});
    constraints.push(
      patterns.length > 0
        ? { anyOf: patterns.map((pattern) => ({ pattern })) }
        : { not: {} },
    );
  }

  return {
    type: 'string',
    ...(constraints.length > 0 ? { allOf: constraints } : {}),
  };
};

export const validateDynamicPropertyName = ({
  propertyName,
  currentPropertyName,
  data,
  reservedPropertyNames = [],
  allowDots = false,
  allowEmptyPropertyNames = false,
  propertyNameSchema,
  ajv,
}: DynamicPropertyNameValidationOptions): DynamicPropertyNameValidationError | null => {
  if (!allowEmptyPropertyNames && propertyName.trim().length === 0) {
    return { reason: 'invalid' };
  }

  if (reservedPropertyNames.includes(propertyName)) {
    return { reason: 'alreadyDefined' };
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
  if (!allowDots && propertyName.includes('.')) {
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
