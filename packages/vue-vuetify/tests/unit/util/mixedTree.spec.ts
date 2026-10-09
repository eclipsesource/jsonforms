import type { ControlElement } from '@jsonforms/core';
import type { JsonSchema7 as JsonSchema } from '@jsonforms/core';
import { describe, expect, it } from 'vitest';
import {
  buildTreeFromData,
  createMixedRenderInfos,
  findNodeById,
  flattenTree,
  getJsonDataType,
  getSchemaTypesAsArray,
  schemaSupportsInputType,
  toTreeNodeId,
} from '../../../src/util/mixedTree';

describe('mixed tree utilities', () => {
  const itemLabel = (index: number) => `Item ${index + 1}`;

  describe('deletion permissions', () => {
    const schema: JsonSchema = {
      type: 'object',
      required: ['requiredChild'],
      properties: {
        requiredChild: { type: 'object' },
        list: { $ref: '#/definitions/list' },
      },
      definitions: {
        list: { type: 'array', minItems: 1, items: { type: 'object' } },
      },
    };
    const data = { requiredChild: {}, list: [{}], optional: true };

    it.each([true, false])(
      'applies schema restrictions only when restrict is %s',
      (restrict) => {
        const nodes = flattenTree(
          buildTreeFromData(
            data,
            schema,
            schema,
            '',
            '',
            true,
            false,
            true,
            itemLabel,
            restrict,
          ),
        );
        expect(nodes.find((node) => node.control.path === '')?.canDelete).toBe(
          false,
        );
        expect(
          nodes.find((node) => node.control.path === 'requiredChild')
            ?.canDelete,
        ).toBe(!restrict);
        expect(
          nodes.find((node) => node.control.path === 'list.0')?.canDelete,
        ).toBe(!restrict);
        expect(
          nodes.find((node) => node.control.path === 'optional')?.canDelete,
        ).toBe(true);
      },
    );

    it.each([
      [false, false],
      [true, true],
    ])(
      'prevents deletion with enabled=%s and readonly=%s',
      (enabled, readonly) => {
        const nodes = flattenTree(
          buildTreeFromData(
            data,
            schema,
            schema,
            '',
            '',
            enabled,
            readonly,
            true,
            itemLabel,
          ),
        );
        expect(nodes.every((node) => !node.canDelete)).toBe(true);
      },
    );

    it('protects minProperties and permits deletion above minItems', () => {
      const root: JsonSchema = {
        type: 'object',
        minProperties: 1,
        properties: {
          list: { type: 'array', minItems: 1, items: { type: 'number' } },
        },
      };
      const nodes = flattenTree(
        buildTreeFromData(
          { list: [1, 2] },
          root,
          root,
          '',
          '',
          true,
          false,
          true,
          itemLabel,
          true,
        ),
      );
      expect(
        nodes.find((node) => node.control.path === 'list')?.canDelete,
      ).toBe(false);
      expect(
        nodes.find((node) => node.control.path === 'list.0')?.canDelete,
      ).toBe(true);
    });
  });

  describe('JSON type handling', () => {
    it('distinguishes JSON-compatible values, including integers', () => {
      expect(getJsonDataType('value')).toBe('string');
      expect(getJsonDataType(1)).toBe('integer');
      expect(getJsonDataType(1.5)).toBe('number');
      expect(getJsonDataType(false)).toBe('boolean');
      expect(getJsonDataType([])).toBe('array');
      expect(getJsonDataType({})).toBe('object');
      expect(getJsonDataType(null)).toBe('null');
      expect(getJsonDataType(undefined)).toBeNull();
    });

    it('derives schema types from type arrays and enums', () => {
      expect(getSchemaTypesAsArray({ type: ['string', 'null'] })).toEqual([
        'string',
        'null',
      ]);
      expect(getSchemaTypesAsArray({ enum: [1, 2.5] })).toEqual([
        'integer',
        'number',
      ]);
    });

    it('allows integers to use a number schema', () => {
      expect(schemaSupportsInputType('number', 'integer')).toBe(true);
      expect(schemaSupportsInputType('integer', 'number')).toBe(false);
      expect(schemaSupportsInputType(['number', 'null'], 'number')).toBe(false);
    });
  });

  it('creates cleaned render schemas for each supported mixed type', () => {
    const schema: JsonSchema = {
      type: ['string', 'array'],
      default: 'default value',
      minLength: 2,
      minItems: 1,
      // Boolean items are valid JSON Schema but absent from core's items type.
      items: true as unknown as JsonSchema,
    };
    const originalSchema = structuredClone(schema);
    const control: ControlElement = {
      type: 'Control',
      scope: '#',
      options: {
        'array-detail': { type: 'Control', scope: '#/items' },
      },
    };

    const infos = createMixedRenderInfos(
      schema,
      schema,
      schema,
      control,
      '',
      [],
    );

    expect(infos.map((info) => info.label)).toEqual(['string', 'array']);
    expect(infos[0].resolvedSchema.default).toBe('default value');
    expect(infos[0].schema).toMatchObject({
      type: 'string',
      minLength: 2,
    });
    expect(infos[0].schema.minItems).toBeUndefined();
    expect(infos[1].resolvedSchema.default).toBeUndefined();
    expect(infos[1].resolvedSchema.items).toEqual({
      type: [
        'array',
        'boolean',
        'integer',
        'null',
        'number',
        'object',
        'string',
      ],
    });
    expect(infos[1].schema).toMatchObject({ type: 'array', minItems: 1 });
    expect(infos[1].schema.minLength).toBeUndefined();
    expect(infos[1].uischema).toMatchObject({
      type: 'Control',
      scope: '#/items',
    });
    expect(schema).toEqual(originalSchema);
  });

  it('builds nested object and array nodes with absolute paths', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        declared: { type: 'string' },
      },
      additionalProperties: true,
    };
    const data = {
      declared: 'value',
      dynamic: {
        items: [1, { deep: true }],
      },
    };

    const tree = buildTreeFromData(
      data,
      schema,
      schema,
      'data',
      'Data',
      true,
      false,
      true,
      itemLabel,
    );

    expect(flattenTree(tree).map((node) => node.nodeId)).toEqual([
      '$path:data',
      '$path:data.declared',
      '$path:data.dynamic',
      '$path:data.dynamic.items',
      '$path:data.dynamic.items.0',
      '$path:data.dynamic.items.1',
      '$path:data.dynamic.items.1.deep',
    ]);
    expect(findNodeById(tree, '$path:data.declared')).toMatchObject({
      jsonType: 'string',
      canRename: false,
      canDelete: true,
    });
    expect(findNodeById(tree, '$path:data.dynamic')).toMatchObject({
      jsonType: 'object',
      canRename: true,
      canDelete: true,
    });
    expect(findNodeById(tree, '$path:data.dynamic.items.1.deep')).toMatchObject(
      {
        title: 'deep',
        jsonType: 'boolean',
        control: {
          path: 'data.dynamic.items.1.deep',
          enabled: true,
          readonly: false,
        },
      },
    );
  });

  it('hides primitive nodes while retaining complex descendants', () => {
    const schema: JsonSchema = {
      type: 'object',
      additionalProperties: true,
    };
    const tree = buildTreeFromData(
      { primitive: 1, nested: { value: 2 } },
      schema,
      schema,
      '',
      '',
      true,
      false,
      false,
      itemLabel,
    );

    expect(tree[0].nodeId).toBe('$root');
    expect(tree[0].title).toBe('{}');
    expect(tree[0].children?.map((node) => node.nodeId)).toEqual([
      '$path:nested',
    ]);
    expect(tree[0].children?.[0].children).toBeUndefined();
  });

  it('uses tuple and referenced schemas without mutating the input schema', () => {
    const rootSchema: JsonSchema = {
      type: 'array',
      items: [
        { $ref: '#/definitions/count' },
        { type: 'object', additionalProperties: false },
      ],
      definitions: {
        count: { type: 'number', minimum: 0 },
      },
    };
    const originalSchema = structuredClone(rootSchema);
    const tree = buildTreeFromData(
      [3, {}],
      rootSchema,
      rootSchema,
      'values',
      'Values',
      false,
      true,
      true,
      itemLabel,
    );

    expect(findNodeById(tree, '$path:values.0')).toMatchObject({
      title: 'Item 1',
      jsonType: 'integer',
      canRename: false,
      control: {
        schema: { type: 'number', minimum: 0, title: 'Item 1' },
        enabled: false,
        readonly: true,
      },
    });
    expect(findNodeById(tree, '$path:values.1')?.control.schema).toMatchObject({
      type: 'object',
      additionalProperties: false,
    });
    expect(rootSchema).toEqual(originalSchema);
  });

  it('returns no tree for primitive root data and no match for unknown ids', () => {
    expect(
      buildTreeFromData(
        'value',
        { type: 'string' },
        { type: 'string' },
        'value',
        'Value',
        true,
        false,
        true,
        itemLabel,
      ),
    ).toEqual([]);
    expect(findNodeById([], toTreeNodeId('missing'))).toBeUndefined();
  });
});

it('combines readOnly constraints from all matching property patterns', () => {
  const schema: JsonSchema = {
    type: 'object',
    patternProperties: {
      '^locked': { type: 'object', readOnly: false },
      locked$: { allOf: [{ readOnly: true }] },
    },
  };
  const nodes = flattenTree(
    buildTreeFromData(
      { locked: { child: 1 }, editable: 2 },
      schema,
      schema,
      '',
      '',
      true,
      false,
      true,
      String,
    ),
  );
  const locked = nodes.filter((node) => node.control.path.startsWith('locked'));
  expect(
    locked.every(
      (node) => node.control.readonly && !node.canRename && !node.canDelete,
    ),
  ).toBe(true);
  expect(nodes.find((node) => node.label === 'editable')?.canDelete).toBe(true);
});
