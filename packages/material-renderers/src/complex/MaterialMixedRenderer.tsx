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
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  compose,
  ControlElement,
  ControlProps,
  createControlElement,
  createDefaultValue,
  findUISchema,
  isControl,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  JsonSchema7,
  rankWith,
  RankedTester,
  resolveSchema as resolveSchemaCore,
  Scopable,
  TesterContext,
  UISchemaElement,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsControlProps } from '@jsonforms/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import {
  Abc,
  Add,
  DeleteOutline,
  EditOutlined,
  ExpandMore,
  FolderOutlined,
  FormatListBulleted,
  Numbers,
  Search,
  ToggleOnOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import { useInputVariant } from '../util';
import { DynamicPropertyDispatch } from './DynamicPropertyDispatch';

type JsonDataType =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string';

interface SchemaRenderInfo {
  schema: JsonSchema;
  resolvedSchema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
  index: number;
}

interface TreeNodeControl {
  id: string;
  schema: JsonSchema;
  uischema: ControlElement;
  path: string;
  label: string;
  required: boolean;
  enabled: boolean;
  readonly?: boolean;
}

interface MixedTreeNode {
  nodeId: string;
  title: string;
  jsonType: JsonDataType;
  label: string;
  canRename: boolean;
  canDelete: boolean;
  control: TreeNodeControl;
  children?: MixedTreeNode[];
}

interface NavigationContext {
  selectPath: (path: string) => void;
}

const MixedNavigationContext = createContext<NavigationContext | undefined>(
  undefined
);

const EMPTY_UISCHEMAS: JsonFormsUISchemaRegistryEntry[] = [];
const ROOT_TREE_NODE_ID = '$root';
const toTreeNodeId = (path: string) =>
  path ? `$path:${path}` : ROOT_TREE_NODE_ID;

const resolveSchema = (schema: JsonSchema, rootSchema: JsonSchema) => {
  if (typeof schema === 'object' && typeof schema?.$ref === 'string') {
    return resolveSchemaCore(rootSchema, schema.$ref, rootSchema) ?? schema;
  }
  return schema;
};

const cleanSchema = (schema: JsonSchema): JsonSchema => {
  if (typeof schema !== 'object') {
    return schema;
  }

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

const getJsonDataType = (value: any): JsonDataType | null => {
  if (typeof value === 'string') {
    return 'string';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    return 'object';
  }

  return null;
};

const getSchemaTypesAsArray = (schema: JsonSchema): string[] => {
  if (typeof schema !== 'object') {
    return [
      'array',
      'boolean',
      'integer',
      'null',
      'number',
      'object',
      'string',
    ];
  }

  if (typeof schema.type === 'string') {
    return [schema.type];
  }

  if (Array.isArray(schema.type)) {
    return schema.type;
  }

  if (Array.isArray(schema.enum)) {
    const enumTypes = new Set(
      schema.enum.map((value) => getJsonDataType(value))
    );
    if (!enumTypes.has(null)) {
      return Array.from(enumTypes).filter((type) => type !== null) as string[];
    }
  }

  return ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
};

const createMixedRenderInfos = (
  parentSchema: JsonSchema,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[]
): SchemaRenderInfo[] => {
  const resolvedSchemas: JsonSchema[] = [];
  schema = resolveSchema(schema, rootSchema);

  if (typeof schema === 'object' && typeof schema.type === 'string') {
    resolvedSchemas.push(schema);
  } else {
    const types = getSchemaTypesAsArray(schema);

    types.forEach((type) => {
      resolvedSchemas.push({
        ...(typeof schema === 'object' ? schema : {}),
        type,
        default:
          typeof schema === 'object' &&
          schema.default !== undefined &&
          type === getJsonDataType(schema.default)
            ? schema.default
            : undefined,
      });
    });
  }

  return resolvedSchemas
    .map((resolvedSchema) => {
      if (
        typeof resolvedSchema === 'object' &&
        resolvedSchema.type === 'array'
      ) {
        resolvedSchema.items = resolvedSchema.items ?? {};
        resolvedSchema.items = resolveSchema(
          resolvedSchema.items as JsonSchema,
          rootSchema
        );

        if ((resolvedSchema.items as any) === true) {
          resolvedSchema.items = {
            type: [
              'array',
              'boolean',
              'integer',
              'null',
              'number',
              'object',
              'string',
            ],
          };
        } else if (
          typeof (resolvedSchema.items as JsonSchema7).type !== 'string' &&
          !Array.isArray((resolvedSchema.items as JsonSchema7).type)
        ) {
          (resolvedSchema.items as JsonSchema7).type = [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ];
        }
      }

      let cleanedSchema = cleanSchema(cloneDeep(resolvedSchema));
      const schemaType =
        typeof cleanedSchema === 'object' ? cleanedSchema.type : undefined;
      const detailsForSchema = control.options
        ? control.options[`${schemaType}-detail`]
        : undefined;
      const schemaControl = detailsForSchema
        ? {
            ...control,
            options: { ...control.options, detail: detailsForSchema },
          }
        : control;

      if (
        typeof cleanedSchema === 'object' &&
        control.scope &&
        (cleanedSchema.type === 'object' || cleanedSchema.type === 'array')
      ) {
        const segments = control.scope.split('/');
        const startFromRoot = segments[0] === '#' || segments[0] === '';
        const startIndex = startFromRoot ? 1 : 0;

        if (segments.length > startIndex) {
          const schemaPath = segments.slice(startIndex).join('.');
          if (schemaPath && isEqual(get(parentSchema, schemaPath), schema)) {
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
        rootSchema
      );

      return {
        schema: cleanedSchema,
        resolvedSchema,
        uischema,
        label: `${schemaType}`,
      };
    })
    .filter((info) => info.uischema)
    .map((info, index) => ({ ...info, index }));
};

const findPropertySchema = (
  parentSchema: JsonSchema,
  propName: string,
  rootSchema: JsonSchema
): JsonSchema | undefined => {
  if (typeof parentSchema !== 'object') {
    return undefined;
  }

  if (parentSchema.properties?.[propName]) {
    return resolveSchema(parentSchema.properties[propName], rootSchema);
  }

  if (parentSchema.patternProperties) {
    const matchedPattern = Object.keys(parentSchema.patternProperties).find(
      (pattern) => new RegExp(pattern).test(propName)
    );

    if (matchedPattern) {
      return resolveSchema(
        parentSchema.patternProperties[matchedPattern],
        rootSchema
      );
    }
  }

  if (typeof parentSchema.additionalProperties === 'object') {
    return resolveSchema(parentSchema.additionalProperties, rootSchema);
  }

  if (parentSchema.additionalProperties === true) {
    return { additionalProperties: true };
  }

  return undefined;
};

const getArrayItemSchema = (
  parentSchema: JsonSchema,
  index: number,
  rootSchema: JsonSchema
): JsonSchema | undefined => {
  if (typeof parentSchema !== 'object' || !parentSchema.items) {
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
  const objectSchema = cleanSchema(
    cloneDeep({ ...(typeof schema === 'object' ? schema : {}), type: 'object' })
  ) as JsonSchema7;
  objectSchema.additionalProperties =
    objectSchema.additionalProperties !== false
      ? objectSchema.additionalProperties ?? true
      : false;
  return objectSchema;
};

const prepareArraySchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema
): JsonSchema => {
  const arraySchema = cleanSchema(
    cloneDeep({ ...(typeof schema === 'object' ? schema : {}), type: 'array' })
  ) as JsonSchema7;
  arraySchema.items = arraySchema.items ?? {};
  arraySchema.items = resolveSchema(
    arraySchema.items as JsonSchema,
    rootSchema
  ) as JsonSchema7 | JsonSchema7[];

  if ((arraySchema.items as any) === true) {
    arraySchema.items = {
      type: [
        'array',
        'boolean',
        'integer',
        'null',
        'number',
        'object',
        'string',
      ],
    };
  } else if (
    typeof (arraySchema.items as JsonSchema7).type !== 'string' &&
    !Array.isArray((arraySchema.items as JsonSchema7).type)
  ) {
    (arraySchema.items as JsonSchema7).type = [
      'array',
      'boolean',
      'integer',
      'null',
      'number',
      'object',
      'string',
    ];
  }

  return arraySchema;
};

const createFallbackChildSchema = (title: string): JsonSchema => ({
  type: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'],
  title,
});

const getSchemaDefaultType = (schema: JsonSchema): JsonDataType => {
  const schemaTypes = getSchemaTypesAsArray(schema);
  const firstType =
    schemaTypes.find((type) => type !== 'null') ?? schemaTypes[0];
  return (firstType ?? 'object') as JsonDataType;
};

const schemaSupportsInputType = (
  schemaType: JsonSchema7['type'] | undefined,
  dataType: JsonDataType | null
): boolean => {
  if (!dataType || typeof schemaType !== 'string') {
    return false;
  }

  return (
    schemaType === dataType ||
    (schemaType === 'number' && dataType === 'integer')
  );
};

const prepareChildSchema = (
  childType: JsonDataType,
  currentSchema: JsonSchema,
  key: string,
  index: number | null,
  rootSchema: JsonSchema
): JsonSchema => {
  let childSchema: JsonSchema | undefined;

  if (index !== null) {
    childSchema = getArrayItemSchema(currentSchema, index, rootSchema);
    childSchema = childSchema
      ? { ...(childSchema as JsonSchema7), title: `Item ${index}` }
      : {
          type: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ],
          title: `Item ${index}`,
        };
  } else {
    childSchema = findPropertySchema(currentSchema, key, rootSchema);
    childSchema = childSchema
      ? { ...(childSchema as JsonSchema7), title: key }
      : createFallbackChildSchema(key);
  }

  if (
    childType !== 'object' &&
    childType !== 'array' &&
    typeof childSchema === 'object' &&
    (!childSchema.type || (childSchema.type as any) === true)
  ) {
    childSchema.type = [
      'array',
      'boolean',
      'integer',
      'null',
      'number',
      'object',
      'string',
    ];
  }

  if (childType === 'object') {
    return prepareObjectSchema(childSchema);
  }

  if (childType === 'array') {
    return prepareArraySchema(childSchema, rootSchema);
  }

  return childSchema;
};

const createTreeNodeControl = (
  schema: JsonSchema,
  path: string,
  label: string,
  enabled: boolean,
  readonly: boolean | undefined,
  nodeType: JsonDataType,
  controlCache: Map<string, TreeNodeControl>
): TreeNodeControl => {
  const cacheKey = `${path}\u0000${nodeType}`;
  const cached = controlCache.get(cacheKey);
  if (cached) {
    cached.label = label;
    cached.enabled = enabled;
    cached.readonly = readonly;
    return cached;
  }

  const control = {
    id: path,
    schema,
    uischema: createControlElement('#'),
    path,
    label,
    required: false,
    enabled,
    readonly,
  };
  controlCache.set(cacheKey, control);
  return control;
};

const withoutEmptyChildren = (node: MixedTreeNode): MixedTreeNode => {
  const children = node.children?.map(withoutEmptyChildren) ?? [];
  if (children.length === 0) {
    const { children: _children, ...rest } = node;
    return rest;
  }

  return {
    ...node,
    children,
  };
};

const getDisplayTitle = (label: string, type: JsonDataType): string => {
  if (label) {
    return label;
  }
  return type === 'array' ? '[]' : '{}';
};

const isDynamicProperty = (parentSchema: JsonSchema, key: string): boolean =>
  typeof parentSchema !== 'object' || !parentSchema.properties?.[key];

const buildTreeFromData = (
  data: any,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  path: string,
  label: string,
  enabled: boolean,
  readonly: boolean | undefined,
  showPrimitives: boolean,
  controlCache: Map<string, TreeNodeControl>
): MixedTreeNode[] => {
  const dataType = getJsonDataType(data);
  if (dataType !== 'object' && dataType !== 'array') {
    return [];
  }

  const nodes: MixedTreeNode[] = [];

  const traverse = (
    value: any,
    currentPath: string,
    currentLabel: string,
    currentSchema: JsonSchema,
    children: MixedTreeNode[],
    canRename = false,
    canDelete = false
  ) => {
    const type = getJsonDataType(value);

    if (type === 'object') {
      const objectSchema = prepareObjectSchema(currentSchema);
      const node: MixedTreeNode = {
        nodeId: toTreeNodeId(currentPath),
        title: getDisplayTitle(currentLabel, type),
        jsonType: type,
        label: currentLabel,
        canRename,
        canDelete,
        control: createTreeNodeControl(
          objectSchema,
          currentPath,
          currentLabel,
          enabled,
          readonly,
          type,
          controlCache
        ),
        children: [],
      };
      children.push(node);

      Object.keys(value).forEach((key) => {
        const childValue = value[key];
        const childPath = compose(currentPath, key);
        const rawChildType = getJsonDataType(childValue);
        const initialChildSchema =
          findPropertySchema(currentSchema, key, rootSchema) ??
          createFallbackChildSchema(key);
        const childType =
          rawChildType ?? getSchemaDefaultType(initialChildSchema);
        const childSchema = prepareChildSchema(
          childType,
          currentSchema,
          key,
          null,
          rootSchema
        );

        if (childType === 'object' || childType === 'array') {
          traverse(
            childValue ?? (childType === 'array' ? [] : {}),
            childPath,
            key,
            childSchema,
            node.children,
            isDynamicProperty(currentSchema, key),
            true
          );
        } else if (showPrimitives) {
          node.children.push({
            nodeId: toTreeNodeId(childPath),
            title: key,
            jsonType: childType,
            label: key,
            canRename: isDynamicProperty(currentSchema, key),
            canDelete: true,
            control: createTreeNodeControl(
              childSchema,
              childPath,
              key,
              enabled,
              readonly,
              childType,
              controlCache
            ),
            children: [],
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
        control: createTreeNodeControl(
          arraySchema,
          currentPath,
          currentLabel,
          enabled,
          readonly,
          type,
          controlCache
        ),
        children: [],
      };
      children.push(node);

      value.forEach((childValue: any, index: number) => {
        const childType = getJsonDataType(childValue);
        const childPath = compose(currentPath, `${index}`);
        const childSchema = prepareChildSchema(
          childType ?? 'object',
          currentSchema,
          '',
          index,
          rootSchema
        );
        const resolvedChildType =
          childType ?? getSchemaDefaultType(childSchema);
        const childLabel = `Item ${index}`;

        if (resolvedChildType === 'object' || resolvedChildType === 'array') {
          traverse(
            childValue ?? (resolvedChildType === 'array' ? [] : {}),
            childPath,
            childLabel,
            childSchema,
            node.children,
            false,
            true
          );
        } else if (showPrimitives) {
          node.children.push({
            nodeId: toTreeNodeId(childPath),
            title: childLabel,
            jsonType: resolvedChildType,
            label: childLabel,
            canRename: false,
            canDelete: true,
            control: createTreeNodeControl(
              childSchema,
              childPath,
              childLabel,
              enabled,
              readonly,
              resolvedChildType,
              controlCache
            ),
            children: [],
          });
        }
      });
    }
  };

  traverse(data, path, label, resolveSchema(schema, rootSchema), nodes);

  return nodes.map(withoutEmptyChildren);
};

const flattenTree = (nodes: MixedTreeNode[]): MixedTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);

const getTreeStructureSignature = (
  value: any,
  showPrimitives: boolean
): string => {
  const type = getJsonDataType(value);

  if (type === 'object') {
    return `o{${Object.keys(value)
      .map((key) => {
        const childType = getJsonDataType(value[key]);
        if (childType === 'object' || childType === 'array') {
          return `${key}:${getTreeStructureSignature(
            value[key],
            showPrimitives
          )}`;
        }
        return showPrimitives ? `${key}:p` : '';
      })
      .filter(Boolean)
      .join('|')}}`;
  }

  if (type === 'array') {
    return `a[${value
      .map((childValue: any) => {
        const childType = getJsonDataType(childValue);
        if (childType === 'object' || childType === 'array') {
          return getTreeStructureSignature(childValue, showPrimitives);
        }
        return showPrimitives ? 'p' : '';
      })
      .join('|')}]`;
  }

  return showPrimitives ? 'p' : '';
};

const filterTreeNodes = (
  nodes: MixedTreeNode[],
  search: string
): MixedTreeNode[] => {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  if (!normalizedSearch) {
    return nodes;
  }

  return nodes.flatMap((node) => {
    const children = filterTreeNodes(node.children ?? [], normalizedSearch);
    const matchesSearch =
      node.title.toLocaleLowerCase().includes(normalizedSearch) ||
      node.label.toLocaleLowerCase().includes(normalizedSearch);

    if (!matchesSearch && children.length === 0) {
      return [];
    }

    return [
      {
        ...node,
        children,
      },
    ];
  });
};

const findNodeById = (
  nodes: MixedTreeNode[],
  targetNodeId: string
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

const getTypeIcon = (type: JsonDataType | undefined) => {
  switch (type) {
    case 'array':
      return <FormatListBulleted fontSize='small' />;
    case 'object':
      return <FolderOutlined fontSize='small' />;
    case 'boolean':
      return <ToggleOnOutlined fontSize='small' />;
    case 'integer':
    case 'number':
      return <Numbers fontSize='small' />;
    case 'string':
      return <Abc fontSize='small' />;
    case 'null':
    default:
      return <Add fontSize='small' sx={{ visibility: 'hidden' }} />;
  }
};

const getRelativePath = (rootPath: string, nodePath: string): string | null => {
  if (nodePath === rootPath) {
    return null;
  }
  return rootPath && nodePath.startsWith(`${rootPath}.`)
    ? nodePath.slice(rootPath.length + 1)
    : nodePath;
};

const getParentPath = (rootPath: string, nodePath: string): string => {
  const lastDot = nodePath.lastIndexOf('.');
  return lastDot > 0 ? nodePath.substring(0, lastDot) : rootPath;
};

const TypeSelector = ({
  id,
  label,
  required,
  enabled,
  readonly,
  errors,
  selectedIndex,
  infos,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  enabled: boolean;
  readonly?: boolean;
  errors?: string;
  selectedIndex: number | undefined;
  infos: SchemaRenderInfo[];
  onChange: (index: number | undefined) => void;
}) => {
  const variant = useInputVariant();
  const hasErrors = Boolean(errors);

  return (
    <FormControl
      fullWidth
      error={hasErrors}
      required={required}
      variant={variant}
      size='small'
    >
      <InputLabel id={`${id}-type-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-type-label`}
        id={`${id}-type-selector`}
        value={selectedIndex ?? ''}
        label={label}
        disabled={!enabled}
        readOnly={readonly}
        onChange={(event) => {
          const value = event.target.value as number | '';
          onChange(value === '' ? undefined : Number(value));
        }}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {infos.map((info) => (
          <MenuItem key={info.index} value={info.index}>
            {info.label}
          </MenuItem>
        ))}
      </Select>
      {hasErrors && (
        <Typography color='error' variant='caption' sx={{ mt: 0.5, ml: 1.75 }}>
          {errors}
        </Typography>
      )}
    </FormControl>
  );
};

export const MaterialMixedRenderer = ({
  cells,
  data,
  enabled,
  errors,
  handleChange,
  id,
  label,
  path,
  readonly,
  renderers,
  required,
  rootSchema,
  schema: controlSchema,
  uischema,
  visible,
}: ControlProps) => {
  const jsonforms = useJsonForms();
  const navigationContext = useContext(MixedNavigationContext);
  const isRoot = !navigationContext;
  const [valueType, setValueType] = useState<JsonDataType | null>(
    getJsonDataType(data)
  );
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [activeNodeId, setActiveNodeId] = useState(toTreeNodeId(path));
  const [openedNodes, setOpenedNodes] = useState<string[]>([]);
  const [treeSearch, setTreeSearch] = useState('');
  const [showPrimitivesInTree, setShowPrimitivesInTree] = useState(false);
  const [renamingNodeId, setRenamingNodeId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [treeWidth, setTreeWidth] = useState(320);
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [draggingSplitter, setDraggingSplitter] = useState(false);
  const latestTreeData = useRef(data);
  const treeControlCache = useRef(new Map<string, TreeNodeControl>());
  const inputVariant = useInputVariant();

  const uischemas = jsonforms.uischemas ?? EMPTY_UISCHEMAS;
  const mixedRenderInfos = useMemo(
    () =>
      createMixedRenderInfos(
        controlSchema,
        controlSchema,
        rootSchema,
        uischema,
        path,
        uischemas
      ),
    [controlSchema, rootSchema, uischema, path, uischemas]
  );
  const matchingSchema = useMemo(() => {
    const exact = mixedRenderInfos.find(
      (entry) => entry.resolvedSchema.type === valueType
    );
    return (
      exact ??
      mixedRenderInfos.find(
        (entry) =>
          entry.resolvedSchema.type === 'number' && valueType === 'integer'
      )
    );
  }, [mixedRenderInfos, valueType]);
  const activeInfo =
    selectedIndex !== undefined ? mixedRenderInfos[selectedIndex] : undefined;
  const activeType = activeInfo?.resolvedSchema?.type;
  const inlineDetailInfo =
    activeInfo?.schema && activeInfo?.uischema && activeType !== 'null'
      ? activeInfo
      : undefined;
  const showTreeView =
    isRoot && (valueType === 'object' || valueType === 'array');
  const isNestedComplexType =
    !isRoot && (valueType === 'object' || valueType === 'array');
  latestTreeData.current = data;

  useEffect(() => {
    setValueType(getJsonDataType(data));
  }, [data]);

  useEffect(() => {
    const currentlySelected =
      selectedIndex !== undefined ? mixedRenderInfos[selectedIndex] : undefined;
    if (
      currentlySelected &&
      schemaSupportsInputType(currentlySelected.resolvedSchema.type, valueType)
    ) {
      return;
    }
    setSelectedIndex(matchingSchema?.index);
  }, [matchingSchema?.index, mixedRenderInfos, selectedIndex, valueType]);

  const treeStructureSignature = useMemo(
    () =>
      showTreeView ? getTreeStructureSignature(data, showPrimitivesInTree) : '',
    [data, showPrimitivesInTree, showTreeView]
  );
  const treeNodes = useMemo(
    () =>
      showTreeView
        ? buildTreeFromData(
            latestTreeData.current,
            activeInfo?.resolvedSchema ?? controlSchema,
            rootSchema,
            path,
            label,
            enabled,
            readonly,
            showPrimitivesInTree,
            treeControlCache.current
          )
        : [],
    [
      activeInfo?.resolvedSchema,
      controlSchema,
      enabled,
      label,
      path,
      readonly,
      rootSchema,
      showPrimitivesInTree,
      showTreeView,
      treeStructureSignature,
    ]
  );
  const selectedNode = useMemo(
    () => findNodeById(treeNodes, activeNodeId),
    [treeNodes, activeNodeId]
  );
  const filteredTreeNodes = useMemo(
    () => filterTreeNodes(treeNodes, treeSearch),
    [treeNodes, treeSearch]
  );
  const expandedTreeItems = useMemo(
    () =>
      treeSearch.trim()
        ? flattenTree(filteredTreeNodes).map((node) => node.nodeId)
        : openedNodes,
    [filteredTreeNodes, openedNodes, treeSearch]
  );

  useEffect(() => {
    const allNodeIds = flattenTree(treeNodes).map((node) => node.nodeId);
    const allNodeIdSet = new Set(allNodeIds);
    const rootNodeId = toTreeNodeId(path);
    if (!allNodeIdSet.has(activeNodeId)) {
      setActiveNodeId(rootNodeId);
    }
    setOpenedNodes((current) =>
      Array.from(new Set([rootNodeId, ...current])).filter((nodeId) =>
        allNodeIdSet.has(nodeId)
      )
    );
  }, [treeNodes, path, activeNodeId]);

  useEffect(() => {
    if (!draggingSplitter) {
      return undefined;
    }

    const onMouseMove = (event: MouseEvent) => {
      setTreeWidth(Math.min(640, Math.max(220, event.clientX - 32)));
    };
    const onMouseUp = () => setDraggingSplitter(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggingSplitter]);

  const getPathAncestorNodeIds = useCallback(
    (targetPath: string): string[] => {
      const segments = targetPath.split('.').filter(Boolean);
      const result = [toTreeNodeId(path)];
      let currentPath = path;

      segments.slice(0, -1).forEach((segment) => {
        currentPath = compose(currentPath, segment);
        result.push(toTreeNodeId(currentPath));
      });

      return result;
    },
    [path]
  );

  const selectPath = useCallback(
    (targetPath: string) => {
      setActiveNodeId(toTreeNodeId(targetPath));
      setOpenedNodes((current) =>
        Array.from(new Set([...current, ...getPathAncestorNodeIds(targetPath)]))
      );
    },
    [getPathAncestorNodeIds]
  );

  const navigationValue = useMemo(() => ({ selectPath }), [selectPath]);

  const getParentSchema = useCallback(
    (parentPath: string): JsonSchema | undefined => {
      const parentRelativePath = getRelativePath(path, parentPath);
      if (parentRelativePath === null) {
        return activeInfo?.resolvedSchema ?? controlSchema;
      }

      const segments = parentRelativePath.split('.');
      let currentSchema: JsonSchema =
        activeInfo?.resolvedSchema ?? controlSchema;

      for (const segment of segments) {
        currentSchema = resolveSchema(currentSchema, rootSchema);
        if (typeof currentSchema !== 'object') {
          return {};
        }
        if (currentSchema.type === 'array') {
          currentSchema = (currentSchema.items as JsonSchema) ?? {};
        } else {
          currentSchema =
            currentSchema.properties?.[segment] ??
            findPropertySchema(currentSchema, segment, rootSchema) ??
            {};
        }
      }

      return currentSchema;
    },
    [activeInfo?.resolvedSchema, controlSchema, path, rootSchema]
  );

  const startRename = useCallback((node: MixedTreeNode) => {
    if (!node.canRename) {
      return;
    }
    setRenamingNodeId(node.nodeId);
    setRenameValue(node.label);
    setRenameError(null);
  }, []);

  const cancelRename = useCallback(() => {
    setRenamingNodeId(null);
    setRenameValue('');
    setRenameError(null);
  }, []);

  const commitRename = useCallback(
    (node: MixedTreeNode) => {
      if (renamingNodeId !== node.nodeId) {
        return;
      }

      const trimmed = renameValue.trim();
      if (!trimmed || trimmed === node.label) {
        cancelRename();
        return;
      }

      const parentPath = getParentPath(path, node.control.path);
      const parentRelativePath = getRelativePath(path, parentPath);
      const parentData =
        parentRelativePath === null ? data : get(data, parentRelativePath);

      if (
        typeof parentData !== 'object' ||
        parentData === null ||
        Array.isArray(parentData)
      ) {
        cancelRename();
        return;
      }

      if (trimmed in parentData) {
        setRenameError(`Property "${trimmed}" already exists`);
        return;
      }

      let parentSchema = getParentSchema(parentPath);
      if (parentSchema) {
        parentSchema = resolveSchema(parentSchema, rootSchema);
      }

      if (typeof parentSchema === 'object' && parentSchema.patternProperties) {
        const patterns = Object.keys(parentSchema.patternProperties);
        const hadMatchingPattern = patterns.some((pattern) =>
          new RegExp(pattern).test(node.label)
        );
        const hasMatchingPattern = patterns.some((pattern) =>
          new RegExp(pattern).test(trimmed)
        );
        if (hadMatchingPattern && !hasMatchingPattern) {
          setRenameError(
            `Property name must match pattern: ${patterns.join(', ')}`
          );
          return;
        }
      }

      const propertyNames = (parentSchema as JsonSchema7)?.propertyNames as
        | JsonSchema7
        | undefined;
      if (propertyNames?.pattern) {
        const pattern = new RegExp(propertyNames.pattern);
        if (!pattern.test(trimmed)) {
          setRenameError(
            `Property name must match pattern: ${propertyNames.pattern}`
          );
          return;
        }
      }

      const updatedData = Object.fromEntries(
        Object.entries(parentData).map(([key, value]) => [
          key === node.label ? trimmed : key,
          value,
        ])
      );
      handleChange(parentPath, updatedData);

      const newPath = compose(parentPath, trimmed);
      selectPath(newPath);
      cancelRename();
    },
    [
      cancelRename,
      data,
      getParentSchema,
      handleChange,
      path,
      renameValue,
      renamingNodeId,
      rootSchema,
      selectPath,
    ]
  );

  const deleteNode = useCallback(
    (node: MixedTreeNode) => {
      if (!node.canDelete) {
        return;
      }

      const parentPath = getParentPath(path, node.control.path);
      const parentRelativePath = getRelativePath(path, parentPath);
      const parentData =
        parentRelativePath === null ? data : get(data, parentRelativePath);
      const key = node.control.path.slice(
        parentPath.length ? parentPath.length + 1 : 0
      );

      if (Array.isArray(parentData)) {
        const index = Number(key);
        if (!Number.isInteger(index)) {
          return;
        }
        const updatedData = [...parentData];
        updatedData.splice(index, 1);
        handleChange(parentPath, updatedData);
      } else if (typeof parentData === 'object' && parentData !== null) {
        const updatedData = { ...parentData };
        delete updatedData[key];
        handleChange(parentPath, updatedData);
      }

      if (
        activeNodeId === node.nodeId ||
        activeNodeId.startsWith(`${node.nodeId}.`)
      ) {
        selectPath(parentPath);
      }
    },
    [activeNodeId, data, handleChange, path, selectPath]
  );

  const handleSelectChange = useCallback(
    (newIndex: number | undefined) => {
      const newData =
        newIndex !== undefined
          ? createDefaultValue(
              mixedRenderInfos[newIndex].resolvedSchema,
              rootSchema
            )
          : undefined;

      handleChange(path, newData);
      setSelectedIndex(newIndex);
      const type =
        newIndex !== undefined
          ? mixedRenderInfos[newIndex]?.resolvedSchema?.type
          : null;
      setValueType(type as JsonDataType | null);
      setActiveNodeId(toTreeNodeId(path));
    },
    [handleChange, mixedRenderInfos, path, rootSchema]
  );

  if (!visible) {
    return null;
  }

  const typeSelector = (
    <TypeSelector
      id={id}
      label={label}
      required={required}
      enabled={enabled}
      readonly={readonly}
      errors={errors}
      selectedIndex={selectedIndex}
      infos={mixedRenderInfos}
      onChange={handleSelectChange}
    />
  );

  const renderTreeNode = (node: MixedTreeNode): React.ReactNode => (
    <TreeItem
      key={node.nodeId}
      itemId={node.nodeId}
      label={
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            minHeight: 32,
            minWidth: 0,
            width: '100%',
            '&:hover .mixed-tree-action, .Mui-selected & .mixed-tree-action': {
              opacity: 1,
            },
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              flex: '0 0 28px',
              justifyContent: 'center',
            }}
          >
            {getTypeIcon(node.jsonType)}
          </Box>
          {renamingNodeId === node.nodeId ? (
            <TextField
              autoFocus
              error={Boolean(renameError)}
              helperText={renameError}
              size='small'
              value={renameValue}
              variant={inputVariant}
              onClick={(event) => event.stopPropagation()}
              onBlur={() => commitRename(node)}
              onChange={(event) => setRenameValue(event.target.value)}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === 'Enter') {
                  commitRename(node);
                } else if (event.key === 'Escape') {
                  cancelRename();
                }
              }}
            />
          ) : (
            <Typography
              noWrap
              sx={{ flex: '1 1 auto', minWidth: 0 }}
              variant='body2'
            >
              {node.title}
            </Typography>
          )}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: '0 0 auto',
              gap: 0.25,
              ml: 0.5,
            }}
          >
            {node.control.path === path ? (
              <Tooltip
                title={
                  showPrimitivesInTree ? 'Hide primitives' : 'Show primitives'
                }
              >
                <IconButton
                  size='small'
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowPrimitivesInTree((current) => !current);
                  }}
                >
                  {showPrimitivesInTree ? (
                    <Visibility fontSize='small' />
                  ) : (
                    <VisibilityOff fontSize='small' />
                  )}
                </IconButton>
              </Tooltip>
            ) : enabled ? (
              <>
                {node.canRename ? (
                  <Tooltip title='Rename'>
                    <IconButton
                      className='mixed-tree-action'
                      size='small'
                      sx={{ opacity: 0 }}
                      onClick={(event) => {
                        event.stopPropagation();
                        startRename(node);
                      }}
                    >
                      <EditOutlined fontSize='small' />
                    </IconButton>
                  </Tooltip>
                ) : null}
                {node.canDelete ? (
                  <Tooltip title='Delete'>
                    <IconButton
                      className='mixed-tree-action'
                      color='error'
                      size='small'
                      sx={{ opacity: 0 }}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNode(node);
                      }}
                    >
                      <DeleteOutline fontSize='small' />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </>
            ) : null}
          </Box>
        </Box>
      }
      sx={{
        '& .MuiTreeItem-content': {
          minHeight: 36,
          pr: 0.5,
        },
        '& .MuiTreeItem-label': {
          minWidth: 0,
        },
      }}
    >
      {node.children?.map((child) => renderTreeNode(child))}
    </TreeItem>
  );

  if (showTreeView) {
    return (
      <MixedNavigationContext.Provider value={navigationValue}>
        <Accordion
          disableGutters
          expanded={treeExpanded}
          variant='outlined'
          onChange={(_, expanded) => setTreeExpanded(expanded)}
          sx={{
            overflow: 'hidden',
            width: '100%',
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              px: 2,
              py: 0,
              '& .MuiAccordionSummary-content': {
                minWidth: 0,
              },
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'minmax(180px, 360px) 1fr',
                minWidth: 0,
                width: '100%',
              }}
            >
              <Box
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
              >
                {typeSelector}
              </Box>
              <Typography noWrap variant='body1'>
                {label}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', minHeight: 320 }}>
              <Box
                sx={{
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  flex: `0 0 ${treeWidth}px`,
                  maxWidth: 640,
                  minWidth: 220,
                  p: 1,
                }}
              >
                <TextField
                  fullWidth
                  size='small'
                  variant={inputVariant}
                  label='Search'
                  value={treeSearch}
                  onChange={(event) => setTreeSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search fontSize='small' />
                      </InputAdornment>
                    ),
                  }}
                />
                <SimpleTreeView
                  expansionTrigger='iconContainer'
                  expandedItems={expandedTreeItems}
                  selectedItems={activeNodeId}
                  onExpandedItemsChange={(_, itemIds) => {
                    if (!treeSearch.trim()) {
                      setOpenedNodes(itemIds);
                    }
                  }}
                  onSelectedItemsChange={(_, itemId) => {
                    if (typeof itemId === 'string') {
                      setActiveNodeId(itemId);
                    }
                  }}
                  sx={{
                    mt: 1,
                    maxHeight: 'calc(100vh - 300px)',
                    overflow: 'auto',
                  }}
                >
                  {filteredTreeNodes.map((node) => renderTreeNode(node))}
                </SimpleTreeView>
              </Box>
              <Divider
                flexItem
                orientation='vertical'
                onMouseDown={() => setDraggingSplitter(true)}
                sx={{
                  bgcolor: draggingSplitter ? 'primary.main' : 'divider',
                  cursor: 'col-resize',
                  width: 6,
                }}
              />
              <Box sx={{ flex: '1 1 auto', minWidth: 0, p: 2 }}>
                {selectedNode ? (
                  <DynamicPropertyDispatch
                    schema={selectedNode.control.schema}
                    uischema={selectedNode.control.uischema}
                    path={selectedNode.control.path}
                    renderers={renderers}
                    cells={cells}
                    enabled={selectedNode.control.enabled}
                    readonly={readonly}
                    rootSchema={rootSchema}
                  />
                ) : null}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </MixedNavigationContext.Provider>
    );
  }

  if (isNestedComplexType) {
    return (
      <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1 }}>
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>{typeSelector}</Box>
        <Tooltip title={`View ${label}`}>
          <span>
            <IconButton
              color='primary'
              disabled={!navigationContext}
              onClick={() => navigationContext?.selectPath(path)}
              size='small'
              sx={{ mt: 0.75 }}
            >
              <Visibility fontSize='small' />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1 }}>
      <Box sx={{ minWidth: 180, flex: '0 0 220px' }}>{typeSelector}</Box>
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        {inlineDetailInfo ? (
          <Collapse in>
            <DynamicPropertyDispatch
              schema={inlineDetailInfo.schema}
              uischema={inlineDetailInfo.uischema}
              path={path}
              renderers={renderers}
              cells={cells}
              enabled={enabled}
              readonly={readonly}
              rootSchema={rootSchema}
            />
          </Collapse>
        ) : null}
      </Box>
    </Box>
  );
};

export const isMixedSchema = (
  uischema: UISchemaElement & Scopable,
  schema: JsonSchema,
  context: TesterContext
) => {
  if (schema && typeof schema === 'boolean') {
    return true;
  }

  if (!schema || typeof schema !== 'object') {
    return false;
  }

  if (Array.isArray(schema.type)) {
    return true;
  }

  if (schema.type === 'object') {
    const schemaPath = uischema.scope;
    if (schemaPath && !isEmpty(schemaPath)) {
      const currentDataSchema = resolveSchemaCore(
        schema,
        schemaPath,
        context?.rootSchema
      );
      if (currentDataSchema === undefined) {
        return false;
      }
      if (Array.isArray(currentDataSchema.type)) {
        return true;
      }
    }
  }

  return false;
};

const isDefaultGenUiSchema = (uischema: UISchemaElement): boolean => {
  const elements = (uischema as any)?.elements;
  return (
    (uischema.type === 'VerticalLayout' || uischema.type === 'Group') &&
    Array.isArray(elements) &&
    elements.length === 1 &&
    elements[0].scope === '#' &&
    elements[0].type === 'Control'
  );
};

export const isMixedControl = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext
) =>
  isMixedSchema(uischema as UISchemaElement & Scopable, schema, context) &&
  (isControl(uischema) || isDefaultGenUiSchema(uischema));

export const materialMixedControlTester: RankedTester = rankWith(
  20,
  isMixedControl
);

export default withJsonFormsControlProps(MaterialMixedRenderer);
