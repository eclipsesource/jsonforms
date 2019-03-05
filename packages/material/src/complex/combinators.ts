import {
  generateDefaultUISchema,
  JsonSchema,
  resolveSchema,
  UISchemaElement
} from '@jsonforms/core';

export interface CombinatorSubSchemaRenderInfo {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

type CombinatorKeyword = 'anyOf' | 'oneOf' | 'allOf';

const createLabel = (
  subSchema: JsonSchema,
  subSchemaIndex: number,
  keyword: CombinatorKeyword
): string => {
  if (subSchema.title) {
    return subSchema.title;
  } else {
    return keyword + '-' + subSchemaIndex;
  }
};

export const resolveSubSchemas = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
  keyword: CombinatorKeyword
) => {
  // resolve any $refs, otherwise the generated UI schema can't match the schema???
  const schemas = schema[keyword] as any[];
  if (schemas.findIndex(e => e.$ref !== undefined) !== -1) {
    return {
      ...schema,
      [keyword]: (schema[keyword] as any[]).map(e =>
        e.$ref ? resolveSchema(rootSchema, e.$ref) : e
      )
    };
  }
  return schema;
};

export const createCombinatorRenderInfos = (
  combinatorSubSchemas: JsonSchema[],
  rootSchema: JsonSchema,
  keyword: CombinatorKeyword
): CombinatorSubSchemaRenderInfo[] =>
  combinatorSubSchemas.map((subSchema, subSchemaIndex) => ({
    schema: subSchema,
    uischema: generateDefaultUISchema(
      subSchema,
      'VerticalLayout',
      `#`,
      rootSchema
    ),
    label: createLabel(subSchema, subSchemaIndex, keyword)
  }));
