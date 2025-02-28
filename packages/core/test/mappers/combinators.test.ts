import test from 'ava';
import { ControlElement, JsonSchema } from '../../src/models';
import {
  createCombinatorRenderInfos,
  getCombinatorIndexOfFittingSchema,
} from '../../src/mappers';

const rootSchema = {
  type: 'object',
  properties: {
    widget: {
      anyOf: [
        {
          $ref: '#/definitions/Dua',
        },
        {
          $ref: '#/definitions/Lipa',
        },
      ],
    },
  },
  definitions: {
    Dua: {
      title: 'Dua',
      type: 'object',
      properties: { name: { type: 'string' } },
    },
    Lipa: {
      title: 'Lipa',
      type: 'object',
      properties: { name: { type: 'string' } },
    },
  },
};

const rootSchemaWithOverrides = {
  ...rootSchema,
  properties: {
    ...rootSchema.properties,
    widget: {
      ...rootSchema.properties.widget,
      anyOf: [
        {
          ...rootSchema.properties.widget.anyOf[0],
          title: 'DuaOverride',
        },
        {
          ...rootSchema.properties.widget.anyOf[1],
          title: 'LipaOverride',
        },
      ],
    },
  },
};

const control: ControlElement = {
  type: 'Control',
  scope: '#',
};

test('createCombinatorRenderInfos - uses titles for labels when subschemas are refs', (t) => {
  const [duaRenderInfo, lipaRenderInfo] = createCombinatorRenderInfos(
    rootSchema.properties.widget.anyOf,
    rootSchema,
    'anyOf',
    control,
    'widget',
    []
  );
  t.deepEqual(duaRenderInfo.label, 'Dua');
  t.deepEqual(lipaRenderInfo.label, 'Lipa');
});

test('createCombinatorRenderInfos - uses overrides for labels when subschemas are refs', (t) => {
  const [duaRenderInfo, lipaRenderInfo] = createCombinatorRenderInfos(
    rootSchemaWithOverrides.properties.widget.anyOf,
    rootSchemaWithOverrides,
    'anyOf',
    control,
    'widget',
    []
  );
  t.deepEqual(duaRenderInfo.label, 'DuaOverride');
  t.deepEqual(lipaRenderInfo.label, 'LipaOverride');
});

const schemaWithoutRefs = {
  type: 'object',
  properties: {
    widget: {
      anyOf: [
        {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
        {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      ],
    },
  },
};

test('createCombinatorRenderInfos - uses keyword + index when no labels provided', (t) => {
  const [duaRenderInfo, lipaRenderInfo] = createCombinatorRenderInfos(
    schemaWithoutRefs.properties.widget.anyOf,
    schemaWithoutRefs,
    'anyOf',
    control,
    'widget',
    []
  );
  t.deepEqual(duaRenderInfo.label, 'anyOf-0');
  t.deepEqual(lipaRenderInfo.label, 'anyOf-1');
});

const schemaWithCustomIdProperty = {
  properties: {
    customId: { const: '123' },
  },
};

const schemaWithId = {
  properties: {
    id: { const: '123' },
  },
};

const schemaWithType = {
  properties: {
    type: { const: 'typeValue' },
  },
};

const schemaWithTypeWithoutConst = {
  properties: {
    type: { type: 'string' },
  },
};

const schemaWithKind = {
  properties: {
    kind: { const: 'kindValue' },
  },
};

const schemaWithFirstString = {
  properties: {
    obj: { type: 'object' },
    name: { const: 'John' },
  },
};

const indexRootSchema = {
  definitions: {
    schemaWithCustomIdProperty,
    schemaWithId,
    schemaWithType,
    schemaWithKind,
    schemaWithFirstString,
  },
};

test('getCombinatorIndexOfFittingSchema - schema with x-jsf-type-property', (t) => {
  const data = { customId: '123' };
  const keyword = 'oneOf';
  const schema = {
    oneOf: [schemaWithId, schemaWithCustomIdProperty],
    'x-jsf-type-property': 'customId',
  };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, 1);
});

test('getCombinatorIndexOfFittingSchema - data with id property', (t) => {
  const data = { id: '123' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithId, schemaWithKind] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  // Id property is not one of the default identification properties
  t.is(result, -1);
});

test('getCombinatorIndexOfFittingSchema - data with type property', (t) => {
  const data = { type: 'typeValue' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithId, schemaWithType] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, 1);
});

test('getCombinatorIndexOfFittingSchema - data with unfitting type property value', (t) => {
  const data = { type: 'wrongTypeValue' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithId, schemaWithType] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, -1);
});

test('getCombinatorIndexOfFittingSchema - schema with type property without const', (t) => {
  const data = { type: 'sometype' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithTypeWithoutConst] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, -1);
});

test('getCombinatorIndexOfFittingSchema - schema with refs and data with type property', (t) => {
  const data = { type: 'typeValue' };
  const keyword = 'oneOf';
  const schema = {
    oneOf: [
      { $ref: '#/definitions/schemaWithId' },
      { $ref: '#/definitions/schemaWithType' },
    ],
  };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, 1);
});

test('getCombinatorIndexOfFittingSchema - data with kind property', (t) => {
  const data = { kind: 'kindValue' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithKind] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, 0);
});

test('getCombinatorIndexOfFittingSchema - data with unfitting kind property value', (t) => {
  const data = { kind: 'wrongKindValue' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithKind] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, -1);
});

test('getCombinatorIndexOfFittingSchema - no matching schema', (t) => {
  const data = { name: 'Doe' };
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithFirstString] };

  const result = getCombinatorIndexOfFittingSchema(
    data,
    keyword,
    schema,
    indexRootSchema
  );
  t.is(result, -1);
});

test('getCombinatorIndexOfFittingSchema - non-object data', (t) => {
  const keyword = 'oneOf';
  const schema = { oneOf: [schemaWithId, schemaWithType] };

  t.is(
    getCombinatorIndexOfFittingSchema(42, keyword, schema, indexRootSchema),
    -1
  );
  t.is(
    getCombinatorIndexOfFittingSchema(
      'string',
      keyword,
      schema,
      indexRootSchema
    ),
    -1
  );
  t.is(
    getCombinatorIndexOfFittingSchema(
      undefined,
      keyword,
      schema,
      indexRootSchema
    ),
    -1
  );
});

test('getCombinatorIndexOfFittingSchema - combinator schemas are absent', (t) => {
  const data = { someProp: 'value' };
  const schema = {};
  const rootSchema = {};
  t.is(
    getCombinatorIndexOfFittingSchema(data, 'oneOf', schema, rootSchema),
    -1
  );

  // Empty oneOf array
  const emptySchema = { oneOf: [] } as JsonSchema;
  t.is(
    getCombinatorIndexOfFittingSchema(data, 'oneOf', emptySchema, rootSchema),
    -1
  );
});
