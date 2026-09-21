import {
  encodeMixedSegment,
  mixedHasUnsafeDeclaredScopes,
} from './mixedLiteral';
import {
  Resolve,
  createControlElement,
  findUISchema,
  type ControlElement,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import {
  canRenameDynamicProperty,
  composePropertyPath,
  findPropertySchema,
  getPropertyNameSchema,
} from './dynamicProperties';

export type JsonDataType =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string';

export const JSON_TYPES: JsonDataType[] = [
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
];

export interface TreeNodeControl {
  schema: JsonSchema;
  uischema: ControlElement;
  path: string;
  enabled: boolean;
  readonly: boolean;
}

export interface MixedTreeNode {
  nodeId: string;
  title: string;
  jsonType: JsonDataType;
  label: string;
  canRename: boolean;
  canDelete: boolean;
  control: TreeNodeControl;
  /** Original allowed types for the selected node editor; control.schema is the tree view. */
  editorSchema: JsonSchema;
  children?: MixedTreeNode[];
}

export interface SchemaRenderInfo {
  schema: JsonSchema;
  resolvedSchema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

const ROOT_TREE_NODE_ID = '$root';

export const toTreeNodeId = (path: string): string =>
  path ? `$path:${path}` : ROOT_TREE_NODE_ID;

export const resolveSchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema => {
  if (typeof schema?.$ref === 'string') {
    return Resolve.schema(rootSchema, schema.$ref, rootSchema) ?? schema;
  }
  return schema;
};

/** Project conjunctive structural constraints for tree actions. Core validates
 * the original schema; introducing allOf here would change renderer selection.
 * A later matching pattern must never relax an earlier bound. */
const combineTreeSchemas = (
  schemas: JsonSchema[],
  rootSchema: JsonSchema,
): JsonSchema7 => {
  const parts = schemas.flatMap((schema) => {
    const resolved = resolveSchema(schema, rootSchema) as JsonSchema7;
    return [
      resolved,
      ...(resolved.allOf ?? []).map((part) =>
        combineTreeSchemas([part], rootSchema),
      ),
    ];
  });
  if (parts.length === 1) return parts[0];
  const result: JsonSchema7 = { ...parts[0] };
  for (const part of parts.slice(1)) {
    if (part.readOnly) result.readOnly = true;
    result.required = [
      ...new Set([...(result.required ?? []), ...(part.required ?? [])]),
    ];
    for (const key of ['minProperties', 'minItems'] as const) {
      if (part[key] !== undefined)
        result[key] = Math.max(result[key] ?? 0, part[key]!);
    }
    for (const key of ['maxProperties', 'maxItems'] as const) {
      if (part[key] !== undefined)
        result[key] = Math.min(result[key] ?? Infinity, part[key]!);
    }
    for (const key of ['properties', 'patternProperties'] as const) {
      if (!part[key]) continue;
      const entries: Record<string, JsonSchema7> = { ...result[key] };
      for (const [name, schema] of Object.entries(part[key]!)) {
        entries[name] = Object.prototype.hasOwnProperty.call(entries, name)
          ? combineTreeSchemas([entries[name], schema], rootSchema)
          : schema;
      }
      result[key] = entries;
    }
    if (part.additionalProperties === false)
      result.additionalProperties = false;
    else if (result.additionalProperties === undefined)
      result.additionalProperties = part.additionalProperties;
    if (result.type === undefined) result.type = part.type;
    if (part.items !== undefined && result.items === undefined)
      result.items = part.items;
  }
  if (
    parts.some(
      (part) =>
        part.propertyNames !== undefined || part.additionalProperties === false,
    )
  ) {
    // Admission and propertyNames constraints are conjunctive too; resolve each
    // name schema before embedding it so local $refs keep their root context.
    result.propertyNames = {
      allOf: parts.map((part) => getPropertyNameSchema(part, rootSchema)),
    };
  }
  return result;
};

const findTreePropertySchema = (
  parent: JsonSchema,
  key: string,
  root: JsonSchema,
): JsonSchema | undefined => {
  const schemas: JsonSchema[] = [];
  const declared = parent.properties?.[key];
  if (declared) schemas.push(declared);
  for (const [pattern, schema] of Object.entries(
    parent.patternProperties ?? {},
  )) {
    if (new RegExp(pattern).test(key)) schemas.push(schema);
  }
  return schemas.length
    ? combineTreeSchemas(schemas, root)
    : findPropertySchema(parent, key, root);
};

export const cleanSchema = (schema: JsonSchema): JsonSchema => {
  const validKeywords: Record<string, string[]> = {
    array: ['items', 'minItems', 'maxItems', 'uniqueItems', 'contains'],
    object: [
      'properties',
      'required',
      'additionalProperties',
      'minProperties',
      'maxProperties',
      'patternProperties',
      'dependencies',
      'propertyNames',
    ],
    string: ['minLength', 'maxLength', 'pattern', 'format'],
    number: [
      'minimum',
      'maximum',
      'exclusiveMinimum',
      'exclusiveMaximum',
      'multipleOf',
    ],
    integer: [
      'minimum',
      'maximum',
      'exclusiveMinimum',
      'exclusiveMaximum',
      'multipleOf',
    ],
    boolean: [],
    null: [],
  };

  const schemaType = schema.type as string;
  for (const validType in validKeywords) {
    if (validType !== schemaType) {
      validKeywords[validType].forEach((key) => {
        delete (schema as any)[key];
      });
    }
  }

  return schema;
};

export const getJsonDataType = (value: any): JsonDataType | null => {
  if (typeof value === 'string') {
    return 'string';
  } else if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (value === null) {
    return 'null';
  } else if (typeof value === 'object') {
    return 'object';
  }

  return null;
};

export const getSchemaTypesAsArray = (schema: JsonSchema): string[] => {
  if (typeof schema.type === 'string') {
    return [schema.type];
  }
  if (Array.isArray(schema.type)) {
    return schema.type;
  }
  if (Array.isArray(schema.enum)) {
    const enumTypes = new Set(
      schema.enum.map((value) => getJsonDataType(value)),
    );
    if (!enumTypes.has(null)) {
      return Array.from(enumTypes).filter((type) => type !== null) as string[];
    }
  }
  return [...JSON_TYPES];
};

export const schemaSupportsInputType = (
  schemaType: JsonSchema['type'] | undefined,
  dataType: JsonDataType | null,
): boolean => {
  if (!dataType || typeof schemaType !== 'string') {
    return false;
  }
  return (
    schemaType === dataType ||
    (schemaType === 'number' && dataType === 'integer')
  );
};

export const createMixedRenderInfos = (
  parentSchema: JsonSchema,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[],
): SchemaRenderInfo[] => {
  const resolvedSourceSchema = resolveSchema(schema, rootSchema);
  const resolvedSchemas =
    typeof resolvedSourceSchema.type === 'string'
      ? [resolvedSourceSchema]
      : getSchemaTypesAsArray(resolvedSourceSchema).map((type) => ({
          ...resolvedSourceSchema,
          type,
          default:
            resolvedSourceSchema.default !== undefined &&
            type === getJsonDataType(resolvedSourceSchema.default)
              ? resolvedSourceSchema.default
              : undefined,
        }));

  return resolvedSchemas.map((sourceSchema) => {
    const resolvedSchema = cloneDeep(sourceSchema);
    if (resolvedSchema.type === 'array') {
      resolvedSchema.items = resolvedSchema.items ?? {};
      resolvedSchema.items = cloneDeep(
        resolveSchema(resolvedSchema.items as JsonSchema, rootSchema),
      );

      if ((resolvedSchema.items as any) === true) {
        resolvedSchema.items = { type: [...JSON_TYPES] };
      } else if (
        typeof (resolvedSchema.items as JsonSchema7).type !== 'string' &&
        !Array.isArray((resolvedSchema.items as JsonSchema7).type)
      ) {
        (resolvedSchema.items as JsonSchema7).type = [...JSON_TYPES];
      }
    }

    let cleanedSchema = cleanSchema(cloneDeep(resolvedSchema));
    const detailsForSchema = control.options
      ? control.options[`${cleanedSchema.type}-detail`]
      : undefined;
    const schemaControl = detailsForSchema
      ? {
          ...control,
          options: { ...control.options, detail: detailsForSchema },
        }
      : control;

    if (
      control.scope &&
      (cleanedSchema.type === 'object' || cleanedSchema.type === 'array')
    ) {
      const segments = control.scope.split('/');
      const startFromRoot = segments[0] === '#' || segments[0] === '';
      const startIndex = startFromRoot ? 1 : 0;

      if (segments.length > startIndex) {
        const schemaPath = segments.slice(startIndex).join('.');
        if (
          schemaPath &&
          isEqual(get(parentSchema, schemaPath), resolvedSourceSchema)
        ) {
          const newSchema = cloneDeep(parentSchema);
          set(newSchema, schemaPath, cleanedSchema);
          cleanedSchema = newSchema;
        }
      }
    }

    const uischema = findUISchema(
      uischemas,
      cleanedSchema,
      control.scope,
      path,
      () => createControlElement(control.scope ?? '#'),
      schemaControl,
      rootSchema,
    );

    return {
      schema: cleanedSchema,
      resolvedSchema,
      uischema,
      label: `${resolvedSchema.type}`,
    };
  });
};

const getArrayItemSchema = (
  parentSchema: JsonSchema,
  index: number,
  rootSchema: JsonSchema,
): JsonSchema | undefined => {
  if (!parentSchema.items) {
    return undefined;
  }

  let itemSchema: JsonSchema | undefined;
  if (Array.isArray(parentSchema.items)) {
    if (index < parentSchema.items.length) {
      itemSchema = parentSchema.items[index];
    } else if (parentSchema.additionalItems) {
      itemSchema =
        typeof parentSchema.additionalItems === 'object'
          ? parentSchema.additionalItems
          : undefined;
    }
  } else {
    itemSchema = parentSchema.items as JsonSchema;
  }

  return itemSchema ? resolveSchema(itemSchema, rootSchema) : undefined;
};

const prepareObjectSchema = (schema: JsonSchema): JsonSchema => {
  const objectSchema = cleanSchema(cloneDeep({ ...schema, type: 'object' }));
  objectSchema.additionalProperties =
    objectSchema.additionalProperties !== false
      ? (objectSchema.additionalProperties ?? true)
      : false;
  return objectSchema;
};

const prepareArraySchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema => {
  const arraySchema = cleanSchema(cloneDeep({ ...schema, type: 'array' }));
  arraySchema.items = arraySchema.items ?? {};
  arraySchema.items = cloneDeep(
    resolveSchema(arraySchema.items as JsonSchema, rootSchema),
  );

  if ((arraySchema.items as any) === true) {
    arraySchema.items = { type: [...JSON_TYPES] };
  } else if (
    typeof (arraySchema.items as JsonSchema7).type !== 'string' &&
    !Array.isArray((arraySchema.items as JsonSchema7).type)
  ) {
    (arraySchema.items as JsonSchema7).type = [...JSON_TYPES];
  }

  return arraySchema;
};

const prepareChildSchema = (
  childType: JsonDataType,
  currentSchema: JsonSchema,
  key: string,
  index: number | null,
  rootSchema: JsonSchema,
  itemLabel?: string,
): JsonSchema => {
  let childSchema: JsonSchema | undefined;

  if (index !== null) {
    childSchema = getArrayItemSchema(currentSchema, index, rootSchema);
    childSchema = childSchema
      ? { ...childSchema, title: itemLabel }
      : { type: [...JSON_TYPES], title: itemLabel };
  } else {
    childSchema = findTreePropertySchema(currentSchema, key, rootSchema);
    childSchema = childSchema
      ? { ...childSchema, title: key }
      : { type: [...JSON_TYPES], title: key };
  }

  if (
    childType !== 'object' &&
    childType !== 'array' &&
    (!childSchema.type || (childSchema.type as any) === true)
  ) {
    childSchema.type = [...JSON_TYPES];
  }

  return childSchema;
};

const getSchemaDefaultType = (schema: JsonSchema): JsonDataType => {
  const schemaTypes = getSchemaTypesAsArray(schema);
  const firstType =
    schemaTypes.find((type) => type !== 'null') ?? schemaTypes[0];
  return (firstType ?? 'object') as JsonDataType;
};

const createTreeNodeControl = (
  schema: JsonSchema,
  path: string,
  enabled: boolean,
  readonly: boolean,
): TreeNodeControl => ({
  schema,
  uischema: createControlElement('#'),
  path,
  enabled,
  readonly,
});

const withoutEmptyChildren = (node: MixedTreeNode): MixedTreeNode => {
  const children = node.children?.map(withoutEmptyChildren) ?? [];
  if (children.length === 0) {
    const rest = { ...node };
    delete rest.children;
    return rest;
  }
  return { ...node, children };
};

const getDisplayTitle = (label: string, type: JsonDataType): string =>
  label || (type === 'array' ? '[]' : '{}');

export const buildTreeFromData = (
  data: any,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  path: string,
  label: string,
  enabled: boolean,
  readonly: boolean,
  showPrimitives: boolean,
  itemLabel: (index: number) => string,
  restrict = false,
): MixedTreeNode[] => {
  const dataType = getJsonDataType(data);
  if (dataType !== 'object' && dataType !== 'array') {
    return [];
  }

  const nodes: MixedTreeNode[] = [];
  const canDeleteChild = (
    parent: any,
    parentSchema: JsonSchema,
    key: string,
    nodeReadonly: boolean,
  ): boolean => {
    if (!enabled || nodeReadonly) return false;
    if (!restrict) return true;
    if (Array.isArray(parent)) {
      return parent.length > (parentSchema.minItems ?? 0);
    }
    return (
      !parentSchema.required?.includes(key) &&
      Object.keys(parent).length > (parentSchema.minProperties ?? 0)
    );
  };

  const traverse = (
    value: any,
    currentPath: string,
    currentLabel: string,
    currentSchema: JsonSchema,
    children: MixedTreeNode[],
    canRename = false,
    canDelete = false,
    inheritedReadonly = readonly,
  ): void => {
    const type = getJsonDataType(value);
    currentSchema = combineTreeSchemas([currentSchema], rootSchema);
    const nodeReadonly = inheritedReadonly || Boolean(currentSchema.readOnly);
    canRename = canRename && !nodeReadonly;
    canDelete = canDelete && !nodeReadonly;

    if (type === 'object') {
      const objectSchema = prepareObjectSchema(currentSchema);
      const node: MixedTreeNode = {
        nodeId: toTreeNodeId(currentPath),
        title: getDisplayTitle(currentLabel, type),
        jsonType: type,
        label: currentLabel,
        canRename,
        canDelete,
        editorSchema: currentSchema.type
          ? currentSchema
          : { ...currentSchema, type: [...JSON_TYPES] },
        control: createTreeNodeControl(
          objectSchema,
          currentPath,
          enabled,
          nodeReadonly ||
            mixedHasUnsafeDeclaredScopes(currentSchema, rootSchema),
        ),
        children: [],
      };
      children.push(node);

      Object.keys(value).forEach((key) => {
        const childValue = value[key];
        const childPath = composePropertyPath(
          currentPath,
          encodeMixedSegment(key),
        );
        const rawChildType = getJsonDataType(childValue);
        const initialChildSchema = findTreePropertySchema(
          currentSchema,
          key,
          rootSchema,
        ) ?? {
          type: [...JSON_TYPES],
          title: key,
        };
        const childType =
          rawChildType ?? getSchemaDefaultType(initialChildSchema);
        const childSchema = prepareChildSchema(
          childType,
          currentSchema,
          key,
          null,
          rootSchema,
        );
        const childReadonly =
          nodeReadonly ||
          Boolean(combineTreeSchemas([childSchema], rootSchema).readOnly);
        const childCanDelete = canDeleteChild(
          value,
          currentSchema,
          key,
          childReadonly,
        );
        const childCanRename = canRenameDynamicProperty({
          schema: currentSchema,
          data: value,
          propertyName: key,
          enabled,
          readonly: childReadonly,
          restrict,
        });

        if (childType === 'object' || childType === 'array') {
          traverse(
            childValue ?? (childType === 'array' ? [] : {}),
            childPath,
            key === '' ? '""' : key,
            childSchema,
            node.children!,
            childCanRename,
            childCanDelete,
            nodeReadonly,
          );
        } else if (showPrimitives) {
          node.children!.push({
            nodeId: toTreeNodeId(childPath),
            title: key === '' ? '""' : key,
            jsonType: childType,
            label: key === '' ? '""' : key,
            editorSchema: childSchema,
            canRename: childCanRename,
            canDelete: childCanDelete,
            control: createTreeNodeControl(
              childSchema,
              childPath,
              enabled,
              childReadonly,
            ),
          });
        }
      });
    } else if (type === 'array') {
      const arraySchema = prepareArraySchema(currentSchema, rootSchema);
      const node: MixedTreeNode = {
        nodeId: toTreeNodeId(currentPath),
        title: getDisplayTitle(currentLabel, type),
        jsonType: type,
        label: currentLabel,
        canRename,
        canDelete,
        editorSchema: currentSchema.type
          ? currentSchema
          : { ...currentSchema, type: [...JSON_TYPES] },
        control: createTreeNodeControl(
          arraySchema,
          currentPath,
          enabled,
          nodeReadonly ||
            mixedHasUnsafeDeclaredScopes(currentSchema, rootSchema),
        ),
        children: [],
      };
      children.push(node);

      value.forEach((childValue: any, index: number) => {
        const childType = getJsonDataType(childValue);
        const childPath = composePropertyPath(currentPath, `${index}`);
        const childLabel = itemLabel(index);
        const childSchema = prepareChildSchema(
          childType ?? 'object',
          currentSchema,
          '',
          index,
          rootSchema,
          childLabel,
        );
        const childReadonly =
          nodeReadonly ||
          Boolean(combineTreeSchemas([childSchema], rootSchema).readOnly);
        const childCanDelete = canDeleteChild(
          value,
          currentSchema,
          `${index}`,
          childReadonly,
        );
        const resolvedChildType =
          childType ?? getSchemaDefaultType(childSchema);

        if (resolvedChildType === 'object' || resolvedChildType === 'array') {
          traverse(
            childValue ?? (resolvedChildType === 'array' ? [] : {}),
            childPath,
            childLabel,
            childSchema,
            node.children!,
            false,
            childCanDelete,
            nodeReadonly,
          );
        } else if (showPrimitives) {
          node.children!.push({
            nodeId: toTreeNodeId(childPath),
            title: childLabel,
            jsonType: resolvedChildType,
            label: childLabel,
            editorSchema: childSchema,
            canRename: false,
            canDelete: childCanDelete,
            control: createTreeNodeControl(
              childSchema,
              childPath,
              enabled,
              childReadonly,
            ),
          });
        }
      });
    }
  };

  traverse(data, path, label, resolveSchema(schema, rootSchema), nodes);
  return nodes.map(withoutEmptyChildren);
};

export const flattenTree = (nodes: MixedTreeNode[]): MixedTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);

export const findNodeById = (
  nodes: MixedTreeNode[],
  targetNodeId: string,
): MixedTreeNode | undefined => {
  for (const node of nodes) {
    if (node.nodeId === targetNodeId) {
      return node;
    }
    const child = findNodeById(node.children ?? [], targetNodeId);
    if (child) {
      return child;
    }
  }
  return undefined;
};
