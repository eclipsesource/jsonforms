<template>
  <div v-if="control.visible" class="mixed-renderer">
    <template v-if="showTreeView">
      <v-expansion-panels v-model="currentlyExpanded" flat>
        <v-expansion-panel>
          <v-expansion-panel-title class="py-0 px-0">
            <v-container class="py-0">
              <v-row>
                <v-col align-self="center" class="pl-0">
                  <v-select
                    v-if="mixedRenderInfos"
                    v-disabled-icon-focus
                    :id="control.id + '-input-selector'"
                    :disabled="!control.enabled"
                    :readonly="control.readonly"
                    :label="computedLabel"
                    :required="control.required"
                    :error-messages="control.errors"
                    :items="mixedRenderInfos"
                    :clearable="isControlEditable(control)"
                    :item-title="
                      (item: SchemaRenderInfo) => t(item.label, item.label)
                    "
                    item-value="index"
                    v-model="selectedIndex"
                    v-bind="vuetifyProps('v-select')"
                    @update:model-value="handleSelectChange"
                    @click.stop
                    @focus="handleFocus"
                    @blur="handleBlur"
                  />
                </v-col>
                <v-col cols="3" align-self="center" class="text-truncate">
                  {{ computedLabel }}
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-container fluid class="mixed-tree-container pa-0">
              <v-splitpanes class="mixed-splitpanes">
                <v-pane min-size="20" size="25">
                  <div class="mixed-tree-pane">
                    <v-text-field
                      v-model="treeSearch"
                      class="mixed-tree-search"
                      density="compact"
                      hide-details
                      clearable
                      label="Search"
                      :prepend-inner-icon="icons.current.value.search"
                      v-bind="vuetifyProps('v-text-field')"
                    />
                    <v-treeview
                      v-model:opened="openedNodes"
                      v-model:activated="activatedTreeNodes"
                      :items="treeNodes"
                      :search="treeSearch"
                      :collapse-icon="icons.current.value.treeCollapse"
                      :expand-icon="icons.current.value.treeExpand"
                      activatable
                      color="primary"
                      density="compact"
                      item-children="children"
                      item-title="title"
                      item-value="nodeId"
                      class="mixed-tree"
                      open-on-click
                    >
                      <template #prepend="{ item }">
                        <v-icon
                          size="small"
                          :icon="getTypeIcon(item.jsonType)"
                        />
                      </template>

                      <template #title="{ item }">
                        <v-text-field
                          v-if="renamingNodeId === item.nodeId"
                          v-model="renameValue"
                          class="mixed-rename-input"
                          density="compact"
                          hide-details
                          autofocus
                          :error="Boolean(renameError)"
                          :title="renameError ?? undefined"
                          v-bind="vuetifyProps('v-text-field')"
                          @click.stop
                          @keydown.stop.enter="commitRename(item)"
                          @keydown.stop.esc="cancelRename"
                          @blur="commitRename(item)"
                        />
                        <span v-else class="mixed-tree-title">
                          {{ item.title }}
                        </span>
                      </template>

                      <template #append="{ item }">
                        <div class="mixed-tree-actions">
                          <v-tooltip
                            v-if="item.control.path === control.path"
                            location="top"
                          >
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                class="mixed-tree-action"
                                :icon="
                                  showPrimitivesInTree
                                    ? icons.current.value.visibilityOn
                                    : icons.current.value.visibilityOff
                                "
                                variant="text"
                                size="x-small"
                                @click.stop="toggleShowPrimitives"
                              />
                            </template>
                            <span>
                              {{
                                showPrimitivesInTree
                                  ? 'Hide primitives'
                                  : 'Show primitives'
                              }}
                            </span>
                          </v-tooltip>
                          <template v-else-if="control.enabled">
                            <v-tooltip v-if="item.canRename" location="top">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="mixed-tree-action mixed-hover-action"
                                  :icon="icons.current.value.itemEdit"
                                  variant="text"
                                  size="x-small"
                                  @click.stop="startRename(item)"
                                />
                              </template>
                              <span>Rename</span>
                            </v-tooltip>
                            <v-tooltip v-if="item.canDelete" location="top">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="mixed-tree-action mixed-hover-action"
                                  :icon="icons.current.value.itemDelete"
                                  variant="text"
                                  size="x-small"
                                  color="error"
                                  @click.stop="deleteNode(item)"
                                />
                              </template>
                              <span>Delete</span>
                            </v-tooltip>
                          </template>
                        </div>
                      </template>
                    </v-treeview>
                  </div>
                </v-pane>

                <v-pane min-size="35" size="75">
                  <div class="mixed-detail-pane">
                    <dispatch-renderer
                      v-if="selectedNode"
                      :schema="selectedNode.control.schema"
                      :uischema="selectedNode.control.uischema"
                      :path="selectedNode.control.path"
                      :renderers="control.renderers"
                      :cells="control.cells"
                      :enabled="selectedNode.control.enabled"
                      :readonly="selectedNode.control.readonly"
                    />
                  </div>
                </v-pane>
              </v-splitpanes>
            </v-container>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>

    <template v-else-if="isNestedComplexType">
      <div class="mixed-nested-complex">
        <v-select
          class="select"
          v-if="mixedRenderInfos"
          v-disabled-icon-focus
          :id="control.id + '-input-selector'"
          :disabled="!control.enabled"
          :readonly="control.readonly"
          :label="computedLabel"
          :required="control.required"
          :error-messages="control.errors"
          :items="mixedRenderInfos"
          :clearable="isControlEditable(control)"
          :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
          item-value="index"
          v-model="selectedIndex"
          v-bind="vuetifyProps('v-select')"
          @update:model-value="handleSelectChange"
          @click.stop
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="mixed-navigate-button"
              :icon="icons.current.value.visibilityOn"
              variant="text"
              color="primary"
              :disabled="!navigationContext"
              @click="selectCurrentPath"
            />
          </template>
          <span>View {{ computedLabel }}</span>
        </v-tooltip>
      </div>
    </template>

    <template v-else>
      <div class="mixed-primitive">
        <v-select
          class="select"
          v-if="mixedRenderInfos"
          v-disabled-icon-focus
          :id="control.id + '-input-selector'"
          :disabled="!control.enabled"
          :readonly="control.readonly"
          :label="computedLabel"
          :required="control.required"
          :error-messages="control.errors"
          :items="mixedRenderInfos"
          :clearable="isControlEditable(control)"
          :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
          item-value="index"
          v-model="selectedIndex"
          v-bind="vuetifyProps('v-select')"
          @update:model-value="handleSelectChange"
          @click.stop
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <dispatch-renderer
          class="input"
          v-if="schema && uischema && !(nullable && control.data === null)"
          :schema="schema"
          :uischema="uischema"
          :path="path"
          :renderers="control.renderers"
          :cells="control.cells"
          :enabled="control.enabled"
          :readonly="control.readonly"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  Resolve,
  compose,
  createControlElement,
  createDefaultValue,
  findUISchema,
  type ControlElement,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonForms,
  useJsonFormsControl,
  useTranslator,
  type RendererProps,
} from '@jsonforms/vue';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  watch,
  type InjectionKey,
} from 'vue';
import {
  VBtn,
  VCol,
  VContainer,
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
  VIcon,
  VRow,
  VSelect,
  VTextField,
  VTooltip,
  VTreeview,
} from 'vuetify/components';
import { VPane, VSplitpanes } from '../components';
import { DisabledIconFocus } from '../controls';
import type { IconValue } from '../icons';
import {
  IsDynamicPropertyContext,
  isControlEditable,
  useCombinatorTranslations,
  useIcons,
  useVuetifyControl,
} from '../util';

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
}

interface TreeNodeControl {
  id: string;
  schema: JsonSchema;
  uischema: ControlElement;
  path: string;
  label: string;
  required: boolean;
  enabled: boolean;
  readonly: boolean;
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

const NavigationContextSymbol: InjectionKey<NavigationContext> = Symbol.for(
  'jsonforms-vue-vuetify:MixedRendererNavigationContext',
);

const ROOT_TREE_NODE_ID = '$root';
const toTreeNodeId = (path: string) =>
  path ? `$path:${path}` : ROOT_TREE_NODE_ID;

function resolveSchema(schema: JsonSchema, rootSchema: JsonSchema): JsonSchema {
  if (typeof schema?.$ref === 'string') {
    return Resolve.schema(rootSchema, schema.$ref, rootSchema) ?? schema;
  }
  return schema;
}

function cleanSchema(schema: JsonSchema): JsonSchema {
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
}

function getSchemaTypesAsArray(schema: JsonSchema): string[] {
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

  return ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
}

const createMixedRenderInfos = (
  parentSchema: JsonSchema,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[],
): SchemaRenderInfo[] => {
  let resolvedSchemas: JsonSchema[] = [];
  schema = resolveSchema(schema, rootSchema);

  if (typeof schema.type === 'string') {
    resolvedSchemas.push(schema);
  } else {
    const types = getSchemaTypesAsArray(schema);

    types.forEach((type) => {
      resolvedSchemas.push({
        ...schema,
        type,
        default:
          schema.default !== undefined &&
          type === getJsonDataType(schema.default)
            ? schema.default
            : undefined,
      });
    });
  }

  return resolvedSchemas.map((resolvedSchema) => {
    if (resolvedSchema.type === 'array') {
      resolvedSchema.items = resolvedSchema.items ?? {};
      resolvedSchema.items = resolveSchema(
        resolvedSchema.items as JsonSchema,
        rootSchema,
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

    const detailsForSchema = control.options
      ? control.options[cleanedSchema.type + '-detail']
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

export function getJsonDataType(value: any): JsonDataType | null {
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
}

function schemaSupportsInputType(
  schemaType: JsonSchema['type'] | undefined,
  dataType: JsonDataType | null,
): boolean {
  if (!dataType || typeof schemaType !== 'string') {
    return false;
  }

  return (
    schemaType === dataType ||
    (schemaType === 'number' && dataType === 'integer')
  );
}

function findPropertySchema(
  parentSchema: JsonSchema,
  propName: string,
  rootSchema: JsonSchema,
): JsonSchema | undefined {
  if (parentSchema.properties?.[propName]) {
    return resolveSchema(parentSchema.properties[propName], rootSchema);
  }

  if (parentSchema.patternProperties) {
    const matchedPattern = Object.keys(parentSchema.patternProperties).find(
      (pattern) => new RegExp(pattern).test(propName),
    );

    if (matchedPattern) {
      return resolveSchema(
        parentSchema.patternProperties[matchedPattern],
        rootSchema,
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
}

function getArrayItemSchema(
  parentSchema: JsonSchema,
  index: number,
  rootSchema: JsonSchema,
): JsonSchema | undefined {
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
}

function prepareObjectSchema(schema: JsonSchema): JsonSchema {
  const objectSchema = cleanSchema(cloneDeep({ ...schema, type: 'object' }));
  objectSchema.additionalProperties =
    objectSchema.additionalProperties !== false
      ? (objectSchema.additionalProperties ?? true)
      : false;
  return objectSchema;
}

function prepareArraySchema(
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema {
  const arraySchema = cleanSchema(cloneDeep({ ...schema, type: 'array' }));
  arraySchema.items = arraySchema.items ?? {};
  arraySchema.items = resolveSchema(
    arraySchema.items as JsonSchema,
    rootSchema,
  );

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
}

function prepareChildSchema(
  childType: JsonDataType,
  currentSchema: JsonSchema,
  key: string,
  index: number | null,
  rootSchema: JsonSchema,
): JsonSchema {
  let childSchema: JsonSchema | undefined;

  if (index !== null) {
    childSchema = getArrayItemSchema(currentSchema, index, rootSchema);
    childSchema = childSchema
      ? { ...childSchema, title: `Item ${index}` }
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
      ? { ...childSchema, title: key }
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
          title: key,
        };
  }

  if (
    childType !== 'object' &&
    childType !== 'array' &&
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
}

function createFallbackChildSchema(title: string): JsonSchema {
  return {
    type: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'],
    title,
  };
}

function getSchemaDefaultType(schema: JsonSchema): JsonDataType {
  const schemaTypes = getSchemaTypesAsArray(schema);
  const firstType =
    schemaTypes.find((type) => type !== 'null') ?? schemaTypes[0];
  return (firstType ?? 'object') as JsonDataType;
}

function createTreeNodeControl(
  schema: JsonSchema,
  path: string,
  label: string,
  enabled: boolean,
  readonly: boolean,
): TreeNodeControl {
  return {
    id: path,
    schema,
    uischema: createControlElement('#'),
    path,
    label,
    required: false,
    enabled,
    readonly,
  };
}

function withoutEmptyChildren(node: MixedTreeNode): MixedTreeNode {
  const children = node.children?.map(withoutEmptyChildren) ?? [];
  if (children.length === 0) {
    const rest = { ...node };
    delete rest.children;
    return rest;
  }
  return {
    ...node,
    children,
  };
}

function getDisplayTitle(label: string, type: JsonDataType): string {
  if (label) {
    return label;
  }
  return type === 'array' ? '[]' : '{}';
}

function isDynamicProperty(parentSchema: JsonSchema, key: string): boolean {
  return !parentSchema.properties?.[key];
}

function buildTreeFromData(
  data: any,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  path: string,
  label: string,
  enabled: boolean,
  readonly: boolean,
  showPrimitives: boolean,
): MixedTreeNode[] {
  const dataType = getJsonDataType(data);
  if (dataType !== 'object' && dataType !== 'array') {
    return [];
  }

  const nodes: MixedTreeNode[] = [];

  function traverse(
    value: any,
    currentPath: string,
    currentLabel: string,
    currentSchema: JsonSchema,
    children: MixedTreeNode[],
    canRename = false,
    canDelete = false,
  ) {
    const type = getJsonDataType(value);

    if (type === 'object') {
      const objectSchema = prepareObjectSchema(currentSchema);
      const nodeId = toTreeNodeId(currentPath);
      const node: MixedTreeNode = {
        nodeId,
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
        ),
        children: [],
      };
      children.push(node);

      Object.keys(value).forEach((key) => {
        const childValue = value[key];
        const childPath = compose(currentPath, key);
        const rawChildType = getJsonDataType(childValue);
        const childCanRename = isDynamicProperty(currentSchema, key);
        const childCanDelete = true;
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
          rootSchema,
        );

        if (childType === 'object' || childType === 'array') {
          traverse(
            childValue ?? (childType === 'array' ? [] : {}),
            childPath,
            key,
            childSchema,
            node.children!,
            childCanRename,
            childCanDelete,
          );
        } else if (showPrimitives) {
          const nodeId = toTreeNodeId(childPath);
          node.children!.push({
            nodeId,
            title: key,
            jsonType: childType,
            label: key,
            canRename: childCanRename,
            canDelete: childCanDelete,
            control: createTreeNodeControl(
              childSchema,
              childPath,
              key,
              enabled,
              readonly,
            ),
            children: [],
          });
        }
      });
    } else if (type === 'array') {
      const arraySchema = prepareArraySchema(currentSchema, rootSchema);
      const nodeId = toTreeNodeId(currentPath);
      const node: MixedTreeNode = {
        nodeId,
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
          rootSchema,
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
            node.children!,
            false,
            true,
          );
        } else if (showPrimitives) {
          const nodeId = toTreeNodeId(childPath);
          node.children!.push({
            nodeId,
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
            ),
            children: [],
          });
        }
      });
    }
  }

  traverse(data, path, label, resolveSchema(schema, rootSchema), nodes);

  return nodes.map(withoutEmptyChildren);
}

function flattenTree(nodes: MixedTreeNode[]): MixedTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);
}

function findNodeByPath(
  nodes: MixedTreeNode[],
  targetPath: string,
): MixedTreeNode | undefined {
  for (const node of nodes) {
    if (node.nodeId === targetPath) {
      return node;
    }
    const child = findNodeByPath(node.children ?? [], targetPath);
    if (child) {
      return child;
    }
  }
  return undefined;
}

const controlRenderer = defineComponent({
  name: 'mixed-renderer',
  components: {
    DispatchRenderer,
    VBtn,
    VCol,
    VContainer,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VIcon,
    VRow,
    VSelect,
    VTextField,
    VTreeview,
    VPane,
    VSplitpanes,
    VTooltip,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const path = props.path;
    const parentSchema = props.schema;
    const input = useJsonFormsControl(props);
    const vuetifyControl = useCombinatorTranslations(useVuetifyControl(input));
    const valueType = ref(getJsonDataType(input.control.value.data));
    const jsonforms = useJsonForms();
    const icons = useIcons();
    const t = useTranslator();
    const navigationContext = inject(NavigationContextSymbol, undefined);
    const isRoot = !navigationContext;
    const activeNodeId = ref(toTreeNodeId(input.control.value.path));
    const openedNodes = ref<string[]>([]);
    const treeSearch = ref('');
    const currentlyExpanded = ref<number | null>(0);
    const showPrimitivesInTree = ref(false);
    const renamingNodeId = ref<string | null>(null);
    const renameValue = ref('');
    const renameError = ref<string | null>(null);

    const mixedRenderInfos = computed<
      (SchemaRenderInfo & {
        index: number;
      })[]
    >(() => {
      const control = input.control.value;
      const result = createMixedRenderInfos(
        parentSchema,
        control.schema,
        control.rootSchema,
        control.uischema,
        control.path,
        jsonforms.uischemas || [],
      );

      return result
        .filter((info) => info.uischema)
        .map((info, index) => ({ ...info, index }));
    });

    const nullable = computed(() =>
      mixedRenderInfos.value.some(
        (info) => info.resolvedSchema.type === 'null',
      ),
    );

    const showTreeView = computed(
      () =>
        isRoot && (valueType.value === 'object' || valueType.value === 'array'),
    );

    const isNestedComplexType = computed(
      () =>
        !isRoot &&
        (valueType.value === 'object' || valueType.value === 'array'),
    );

    const matchingSchema = computed(() => {
      let result = mixedRenderInfos.value.find(
        (entry) => entry.resolvedSchema.type === valueType.value,
      );
      if (!result) {
        result = mixedRenderInfos.value.find(
          (entry) =>
            entry.resolvedSchema.type === 'number' &&
            valueType.value === 'integer',
        );
      }
      return result;
    });

    const selectedIndex = ref<number | undefined | null>(
      matchingSchema.value?.index,
    );

    const schema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value]?.schema
        : undefined,
    );

    const resolvedSchema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value]?.resolvedSchema
        : undefined,
    );

    const uischema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value]?.uischema
        : undefined,
    );

    const treeNodes = computed(() =>
      showTreeView.value
        ? buildTreeFromData(
            input.control.value.data,
            resolvedSchema.value ?? input.control.value.schema,
            input.control.value.rootSchema,
            input.control.value.path,
            vuetifyControl.computedLabel.value,
            input.control.value.enabled,
            input.control.value.readonly,
            showPrimitivesInTree.value,
          )
        : [],
    );

    const selectedNode = computed(() =>
      findNodeByPath(treeNodes.value, activeNodeId.value),
    );

    const activatedTreeNodes = computed<string[]>({
      get: () => [activeNodeId.value],
      set: (value) => {
        const nodeId = value[0];
        if (nodeId && findNodeByPath(treeNodes.value, nodeId)) {
          activeNodeId.value = nodeId;
        }
      },
    });

    const getPathAncestorNodeIds = (path: string): string[] => {
      const segments = path.split('.').filter(Boolean);
      const result = [toTreeNodeId(input.control.value.path)];
      let currentPath = input.control.value.path;

      segments.slice(0, -1).forEach((segment) => {
        currentPath = compose(currentPath, segment);
        result.push(toTreeNodeId(currentPath));
      });

      return result;
    };

    const selectPath = (path: string) => {
      const nodeId = toTreeNodeId(path);
      activeNodeId.value = nodeId;
      openedNodes.value = Array.from(
        new Set([...openedNodes.value, ...getPathAncestorNodeIds(path)]),
      );
    };

    if (isRoot) {
      provide(NavigationContextSymbol, { selectPath });
    }

    watch(
      () => input.control.value.data,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          const oldValueType = valueType.value;
          valueType.value = getJsonDataType(newValue);

          if (oldValueType !== valueType.value) {
            const currentlySelected =
              selectedIndex.value !== null && selectedIndex.value !== undefined
                ? mixedRenderInfos.value[selectedIndex.value]
                : undefined;
            if (
              currentlySelected &&
              schemaSupportsInputType(
                currentlySelected.resolvedSchema.type,
                valueType.value,
              )
            ) {
              return;
            }
            selectedIndex.value = matchingSchema.value?.index;
          }
        }
      },
      { deep: false },
    );

    watch(
      treeNodes,
      (nodes) => {
        const allNodeIds = flattenTree(nodes).map((node) => node.nodeId);
        const allNodeIdSet = new Set(allNodeIds);
        const rootNodeId = toTreeNodeId(input.control.value.path);
        if (!allNodeIds.includes(activeNodeId.value)) {
          activeNodeId.value = rootNodeId;
        }
        openedNodes.value = Array.from(
          new Set([rootNodeId, ...openedNodes.value]),
        ).filter((id) => allNodeIdSet.has(id));
      },
      { immediate: true },
    );

    const getRelativePath = (nodePath: string): string | null => {
      const rootPath = input.control.value.path;
      if (nodePath === rootPath) {
        return null;
      }
      return rootPath && nodePath.startsWith(`${rootPath}.`)
        ? nodePath.slice(rootPath.length + 1)
        : nodePath;
    };

    const getParentPath = (nodePath: string): string => {
      const lastDot = nodePath.lastIndexOf('.');
      return lastDot > 0
        ? nodePath.substring(0, lastDot)
        : input.control.value.path;
    };

    const getParentSchema = (parentPath: string): JsonSchema | undefined => {
      const parentRelativePath = getRelativePath(parentPath);
      if (parentRelativePath === null) {
        return resolvedSchema.value ?? input.control.value.schema;
      }

      const segments = parentRelativePath.split('.');
      let currentSchema: JsonSchema =
        resolvedSchema.value ?? input.control.value.schema;

      for (const segment of segments) {
        currentSchema = resolveSchema(
          currentSchema,
          input.control.value.rootSchema,
        );
        if (currentSchema.type === 'array') {
          currentSchema = (currentSchema.items as JsonSchema) ?? {};
        } else {
          currentSchema =
            currentSchema.properties?.[segment] ??
            findPropertySchema(
              currentSchema,
              segment,
              input.control.value.rootSchema,
            ) ??
            {};
        }
      }

      return currentSchema;
    };

    const toggleShowPrimitives = () => {
      showPrimitivesInTree.value = !showPrimitivesInTree.value;
    };

    const startRename = (node: MixedTreeNode) => {
      if (!node.canRename) {
        return;
      }
      renamingNodeId.value = node.nodeId;
      renameValue.value = node.label;
      renameError.value = null;
    };

    const cancelRename = () => {
      renamingNodeId.value = null;
      renameValue.value = '';
      renameError.value = null;
    };

    const commitRename = (node: MixedTreeNode) => {
      if (renamingNodeId.value !== node.nodeId) {
        return;
      }

      const trimmed = renameValue.value.trim();
      if (!trimmed || trimmed === node.label) {
        cancelRename();
        return;
      }

      const parentPath = getParentPath(node.control.path);
      const parentRelativePath = getRelativePath(parentPath);
      const parentData =
        parentRelativePath === null
          ? input.control.value.data
          : get(input.control.value.data, parentRelativePath);

      if (
        typeof parentData !== 'object' ||
        parentData === null ||
        Array.isArray(parentData)
      ) {
        cancelRename();
        return;
      }

      if (trimmed in parentData) {
        renameError.value = `Property "${trimmed}" already exists`;
        return;
      }

      let parentSchema = getParentSchema(parentPath);
      if (parentSchema) {
        parentSchema = resolveSchema(
          parentSchema,
          input.control.value.rootSchema,
        );
      }

      if (parentSchema?.patternProperties) {
        const hadMatchingPattern = Object.keys(
          parentSchema.patternProperties,
        ).some((pattern) => new RegExp(pattern).test(node.label));
        const hasMatchingPattern = Object.keys(
          parentSchema.patternProperties,
        ).some((pattern) => new RegExp(pattern).test(trimmed));
        if (hadMatchingPattern && !hasMatchingPattern) {
          renameError.value = `Property name must match pattern: ${Object.keys(
            parentSchema.patternProperties,
          ).join(', ')}`;
          return;
        }
      }

      const propertyNames = (parentSchema as any)?.propertyNames as
        | JsonSchema
        | undefined;
      if (propertyNames?.pattern) {
        const pattern = new RegExp(propertyNames.pattern);
        if (!pattern.test(trimmed)) {
          renameError.value = `Property name must match pattern: ${propertyNames.pattern}`;
          return;
        }
      }

      const updatedData = Object.fromEntries(
        Object.entries(parentData).map(([key, value]) => [
          key === node.label ? trimmed : key,
          value,
        ]),
      );
      vuetifyControl.handleChange(parentPath, updatedData);

      const newPath = compose(parentPath, trimmed);
      selectPath(newPath);
      cancelRename();
    };

    const deleteNode = (node: MixedTreeNode) => {
      if (!node.canDelete) {
        return;
      }

      const parentPath = getParentPath(node.control.path);
      const parentRelativePath = getRelativePath(parentPath);
      const parentData =
        parentRelativePath === null
          ? input.control.value.data
          : get(input.control.value.data, parentRelativePath);
      const key = node.control.path.slice(
        parentPath.length ? parentPath.length + 1 : 0,
      );

      if (Array.isArray(parentData)) {
        const index = Number(key);
        if (!Number.isInteger(index)) {
          return;
        }
        const updatedData = [...parentData];
        updatedData.splice(index, 1);
        vuetifyControl.handleChange(parentPath, updatedData);
      } else if (typeof parentData === 'object' && parentData !== null) {
        const updatedData = { ...parentData };
        delete updatedData[key];
        vuetifyControl.handleChange(parentPath, updatedData);
      }

      if (
        activeNodeId.value === node.nodeId ||
        activeNodeId.value.startsWith(`${node.nodeId}.`)
      ) {
        selectPath(parentPath);
      }
    };

    const handleSelectChange = (newIndex: number | null | undefined): void => {
      const newData =
        newIndex != null
          ? createDefaultValue(
              mixedRenderInfos.value[newIndex].resolvedSchema,
              input.control.value.rootSchema,
            )
          : undefined;

      vuetifyControl.handleChange(input.control.value.path, newData);
      selectedIndex.value = newIndex;

      const type =
        newIndex != null
          ? mixedRenderInfos.value[newIndex]?.resolvedSchema?.type
          : null;
      valueType.value = type as JsonDataType | null;
      activeNodeId.value = toTreeNodeId(input.control.value.path);
      currentlyExpanded.value = 0;
    };

    const selectCurrentPath = () => {
      navigationContext?.selectPath(input.control.value.path);
    };

    const getTypeIcon = (type: JsonDataType | undefined): IconValue => {
      switch (type) {
        case 'array':
          return icons.current.value.typeArray;
        case 'object':
          return icons.current.value.typeObject;
        case 'boolean':
          return icons.current.value.typeBoolean;
        case 'integer':
        case 'number':
          return icons.current.value.typeNumber;
        case 'null':
          return icons.current.value.typeNull;
        case 'string':
          return icons.current.value.typeString;
        default:
          return icons.current.value.typeUnknown;
      }
    };

    provide(IsDynamicPropertyContext, true);

    return {
      ...vuetifyControl,
      isControlEditable,
      nullable,
      mixedRenderInfos,
      selectedIndex,
      t,
      valueType,
      schema,
      resolvedSchema,
      uischema,
      path,
      icons,
      currentlyExpanded,
      showTreeView,
      isNestedComplexType,
      treeNodes,
      selectedNode,
      activatedTreeNodes,
      activeNodeId,
      openedNodes,
      treeSearch,
      showPrimitivesInTree,
      renamingNodeId,
      renameValue,
      renameError,
      navigationContext,
      toggleShowPrimitives,
      startRename,
      cancelRename,
      commitRename,
      deleteNode,
      handleSelectChange,
      selectCurrentPath,
      getTypeIcon,
    };
  },
});

export default controlRenderer;
</script>

<style scoped>
.mixed-renderer {
  width: 100%;
}

.mixed-primitive,
.mixed-nested-complex {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.select {
  flex-shrink: 0;
  min-width: 160px;
}

.input {
  flex-grow: 1;
  width: 100%;
}

.mixed-tree-container {
  width: 100%;
}

.mixed-splitpanes {
  min-height: 280px;
}

.mixed-tree-pane {
  height: 100%;
  padding: 8px 16px 8px 0;
}

.mixed-detail-pane {
  height: 100%;
  min-width: 0;
  padding: 8px 0 8px 16px;
}

.mixed-tree-search {
  margin-bottom: 8px;
}

.mixed-tree {
  max-height: calc(100vh - 300px);
  overflow: auto;
}

:deep(.mixed-tree .v-list-item) {
  align-items: center;
}

:deep(.mixed-tree .v-list-item__prepend),
:deep(.mixed-tree .v-list-item__append) {
  align-self: center;
  align-items: center;
}

:deep(.mixed-tree .v-list-item-title) {
  display: flex;
  align-items: center;
  min-height: 32px;
  line-height: 1.25;
}

.mixed-navigate-button {
  margin-top: 4px;
}

.mixed-tree-title {
  display: block;
  max-width: 100%;
  overflow: hidden;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mixed-tree-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.mixed-tree-action {
  opacity: 0.7;
}

.mixed-hover-action {
  opacity: 0;
}

:deep(.v-list-item:hover) .mixed-hover-action,
:deep(.v-list-item--active) .mixed-hover-action,
.mixed-hover-action:focus-visible {
  opacity: 1;
}

.mixed-rename-input {
  min-width: 120px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

@media (max-width: 959px) {
  .mixed-splitpanes {
    min-height: 520px;
  }
}
</style>
