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
import { CommonModule } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import {
  JsonFormsControl,
  JsonFormsModule,
  JsonFormsAngularService,
} from '@jsonforms/angular';
import {
  Actions,
  compose,
  ControlElement,
  createControlElement,
  createDefaultValue,
  findUISchema,
  isControl,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  JsonSchema7,
  rankWith,
  RankedTester,
  Resolve,
  Scopable,
  StatePropsOfControl,
  TesterContext,
  UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
  schema: JsonSchema;
  uischema: ControlElement;
  path: string;
  label: string;
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

interface VisibleTreeItem {
  node: MixedTreeNode;
  depth: number;
  hasChildren: boolean;
  open: boolean;
}

const ROOT_TREE_NODE_ID = '$root';
const ANY_TYPE: JsonDataType[] = [
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
];

const toTreeNodeId = (path: string) =>
  path ? `$path:${path}` : ROOT_TREE_NODE_ID;

const resolveSchema = (schema: JsonSchema, rootSchema: JsonSchema) => {
  if (typeof schema === 'object' && typeof schema?.$ref === 'string') {
    return Resolve.schema(rootSchema, schema.$ref, rootSchema) ?? schema;
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
    return ANY_TYPE;
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

  return ANY_TYPE;
};

const createMixedRenderInfos = (
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
    getSchemaTypesAsArray(schema).forEach((type) => {
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
          resolvedSchema.items = { type: ANY_TYPE };
        } else if (
          typeof (resolvedSchema.items as JsonSchema7).type !== 'string' &&
          !Array.isArray((resolvedSchema.items as JsonSchema7).type)
        ) {
          (resolvedSchema.items as JsonSchema7).type = ANY_TYPE;
        }
      }

      const cleanedSchema = cleanSchema(cloneDeep(resolvedSchema));
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
    arraySchema.items = { type: ANY_TYPE };
  } else if (
    typeof (arraySchema.items as JsonSchema7).type !== 'string' &&
    !Array.isArray((arraySchema.items as JsonSchema7).type)
  ) {
    (arraySchema.items as JsonSchema7).type = ANY_TYPE;
  }

  return arraySchema;
};

const createFallbackChildSchema = (title: string): JsonSchema => ({
  type: ANY_TYPE,
  title,
});

const getSchemaDefaultType = (schema: JsonSchema): JsonDataType => {
  const schemaTypes = getSchemaTypesAsArray(schema);
  const firstType =
    schemaTypes.find((type) => type !== 'null') ?? schemaTypes[0];
  return (firstType ?? 'object') as JsonDataType;
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
      : createFallbackChildSchema(`Item ${index}`);
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
    childSchema.type = ANY_TYPE;
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
  nodeType: JsonDataType,
  controlCache: Map<string, TreeNodeControl>
): TreeNodeControl => {
  const cacheKey = `${path}\u0000${nodeType}`;
  const cached = controlCache.get(cacheKey);
  if (cached) {
    cached.label = label;
    return cached;
  }

  const control = {
    schema,
    uischema: createControlElement('#'),
    path,
    label,
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

const flattenVisibleTree = (
  nodes: MixedTreeNode[],
  openedNodeIds: Set<string>,
  depth = 0,
  search = ''
): VisibleTreeItem[] => {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const isSearching = Boolean(normalizedSearch);

  return nodes.flatMap((node) => {
    const hasChildren = Boolean(node.children?.length);
    const isOpened = hasChildren && openedNodeIds.has(node.nodeId);
    const matchesSearch =
      !normalizedSearch ||
      node.title.toLocaleLowerCase().includes(normalizedSearch) ||
      node.label.toLocaleLowerCase().includes(normalizedSearch);
    const childItems =
      hasChildren && (isSearching || isOpened)
        ? flattenVisibleTree(
            node.children ?? [],
            openedNodeIds,
            depth + 1,
            normalizedSearch
          )
        : [];
    const hasMatchingChildren = childItems.length > 0;

    if (isSearching && !matchesSearch && !hasMatchingChildren) {
      return [];
    }

    const open = isSearching || isOpened;
    const item: VisibleTreeItem = { node, depth, hasChildren, open };

    return hasChildren && open ? [item, ...childItems] : [item];
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

@Component({
  selector: 'MixedRenderer',
  template: `
    <div class="mixed-renderer" *ngIf="!hidden">
      <ng-template #mixedHeader>
        <div
          class="mixed-header"
          [class.mixed-header-root]="showTreeView"
          [class.mixed-header-inline]="isNestedComplexType"
          [class.mixed-header-detail]="showInlineDetail"
        >
          <mat-form-field
            class="mixed-type-selector"
            (click)="$event.stopPropagation()"
            (keydown)="$event.stopPropagation()"
          >
            <mat-label>{{ label }}</mat-label>
            <mat-select
              [disabled]="!isEnabled()"
              [value]="selectedIndex"
              (selectionChange)="handleSelectChange($event.value)"
            >
              <mat-option [value]="undefined"><em>None</em></mat-option>
              <mat-option
                *ngFor="let info of mixedRenderInfos"
                [value]="info.index"
              >
                {{ info.label }}
              </mat-option>
            </mat-select>
            <mat-error>{{ error }}</mat-error>
          </mat-form-field>
          <span class="mixed-root-label" *ngIf="showTreeView">{{ label }}</span>
          <button
            *ngIf="isNestedComplexType"
            mat-icon-button
            color="primary"
            type="button"
            [disabled]="!parentMixedRenderer"
            [matTooltip]="'View ' + label"
            (click)="selectNestedPath()"
          >
            <mat-icon>visibility</mat-icon>
          </button>
          <div class="mixed-inline-detail" *ngIf="showInlineDetail">
            <jsonforms-outlet
              [uischema]="activeInfo.uischema"
              [schema]="activeInfo.schema"
              [path]="propsPath"
              [preserveUndefinedAsDefault]="true"
            ></jsonforms-outlet>
          </div>
        </div>
      </ng-template>

      <ng-template #mixedTree>
        <div class="mixed-tree-shell">
          <aside class="mixed-tree-pane" [style.flex-basis.px]="treeWidth">
            <mat-form-field class="mixed-search">
              <mat-label>Search</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [(ngModel)]="treeSearch"
                (ngModelChange)="rebuildVisibleTree()"
              />
            </mat-form-field>

            <mat-tree
              class="mixed-tree-list"
              [dataSource]="visibleTreeItems"
              [treeControl]="treeControl"
              [trackBy]="trackTreeItem"
            >
              <mat-tree-node
                class="mixed-tree-item"
                tabindex="0"
                *matTreeNodeDef="let item"
                [class.active]="item.node.nodeId === activeNodeId"
                [style.padding-left.px]="8 + item.depth * 20"
                (click)="selectNode(item.node.nodeId)"
                (keydown.enter)="selectNode(item.node.nodeId)"
                (keydown.space)="
                  selectNode(item.node.nodeId); $event.preventDefault()
                "
              >
                <button
                  mat-icon-button
                  class="mixed-expand-button"
                  type="button"
                  *ngIf="item.hasChildren"
                  (click)="toggleNode(item.node, $event)"
                >
                  <mat-icon>{{
                    item.open ? 'expand_more' : 'chevron_right'
                  }}</mat-icon>
                </button>
                <span
                  class="mixed-expand-spacer"
                  *ngIf="!item.hasChildren"
                ></span>
                <mat-icon class="mixed-type-icon">{{
                  getTypeIcon(item.node.jsonType)
                }}</mat-icon>

                <span
                  class="mixed-tree-label"
                  *ngIf="renamingNodeId !== item.node.nodeId"
                >
                  {{ item.node.title }}
                </span>
                <mat-form-field
                  class="mixed-rename-field"
                  *ngIf="renamingNodeId === item.node.nodeId"
                  (click)="$event.stopPropagation()"
                >
                  <input
                    matInput
                    [(ngModel)]="renameValue"
                    (keydown.enter)="commitRename(item.node)"
                    (keydown.escape)="cancelRename()"
                    (blur)="commitRename(item.node)"
                  />
                  <mat-error *ngIf="renameError">{{ renameError }}</mat-error>
                </mat-form-field>

                <span class="mixed-tree-actions">
                  <button
                    mat-icon-button
                    type="button"
                    *ngIf="item.node.control.path === propsPath"
                    [matTooltip]="
                      showPrimitivesInTree
                        ? 'Hide primitives'
                        : 'Show primitives'
                    "
                    (click)="togglePrimitiveVisibility($event)"
                  >
                    <mat-icon>{{
                      showPrimitivesInTree ? 'visibility' : 'visibility_off'
                    }}</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    class="mixed-hover-action"
                    type="button"
                    *ngIf="
                      item.node.control.path !== propsPath &&
                      item.node.canRename &&
                      isEnabled()
                    "
                    matTooltip="Rename"
                    (click)="startRename(item.node, $event)"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    class="mixed-hover-action"
                    type="button"
                    *ngIf="
                      item.node.control.path !== propsPath &&
                      item.node.canDelete &&
                      isEnabled()
                    "
                    matTooltip="Delete"
                    (click)="deleteNode(item.node, $event)"
                  >
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </span>
              </mat-tree-node>
            </mat-tree>
          </aside>

          <div
            class="mixed-splitter"
            [class.dragging]="draggingSplitter"
            (mousedown)="startSplitterDrag($event)"
          ></div>

          <section class="mixed-detail-pane">
            <jsonforms-outlet
              *ngIf="selectedNode"
              [uischema]="selectedNode.control.uischema"
              [schema]="selectedNode.control.schema"
              [path]="selectedNode.control.path"
              [preserveUndefinedAsDefault]="true"
            ></jsonforms-outlet>
          </section>
        </div>
      </ng-template>

      <mat-expansion-panel
        *ngIf="showTreeView; else inlineMixed"
        class="mixed-root-panel"
        [expanded]="treeExpanded"
        (opened)="treeExpanded = true"
        (closed)="treeExpanded = false"
      >
        <mat-expansion-panel-header class="mixed-root-panel-header">
          <ng-container *ngTemplateOutlet="mixedHeader"></ng-container>
        </mat-expansion-panel-header>
        <ng-container *ngTemplateOutlet="mixedTree"></ng-container>
      </mat-expansion-panel>

      <ng-template #inlineMixed>
        <ng-container *ngTemplateOutlet="mixedHeader"></ng-container>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .mixed-renderer {
        width: 100%;
      }
      .mixed-root-panel {
        box-shadow: none;
      }
      .mixed-root-panel-header {
        height: auto;
        min-height: 64px;
      }
      .mixed-root-panel-header .mixed-header {
        width: 100%;
      }
      .mixed-header {
        align-items: flex-start;
        display: flex;
        gap: 8px;
      }
      .mixed-header-root {
        align-items: center;
        display: grid;
        grid-template-columns: minmax(180px, 360px) minmax(0, 1fr);
      }
      .mixed-header-inline {
        align-items: flex-start;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
      }
      .mixed-header-detail {
        align-items: flex-start;
        display: grid;
        grid-template-columns: minmax(180px, 280px) minmax(0, 1fr);
      }
      .mixed-type-selector,
      .mixed-search,
      .mixed-rename-field {
        width: 100%;
      }
      .mixed-root-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mixed-tree-shell {
        border: 1px solid rgba(0, 0, 0, 0.12);
        display: flex;
        min-height: 320px;
        overflow: hidden;
      }
      .mixed-tree-pane {
        box-sizing: border-box;
        flex: 0 0 320px;
        min-width: 220px;
        max-width: 640px;
        padding: 8px;
      }
      .mixed-tree-list {
        max-height: 560px;
        overflow: auto;
        padding: 4px 0;
      }
      .mixed-tree-item {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 4px;
        box-sizing: border-box;
        color: inherit;
        cursor: pointer;
        display: flex;
        font: inherit;
        min-height: 36px;
        outline: none;
        padding: 0 4px 0 0;
        position: relative;
        text-align: left;
        user-select: none;
        width: 100%;
      }
      .mixed-tree-item:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .mixed-tree-item:focus-visible {
        box-shadow: inset 0 0 0 2px #3f51b5;
      }
      .mixed-tree-item.active {
        background: rgba(63, 81, 181, 0.12);
      }
      .mixed-tree-item:hover .mixed-hover-action,
      .mixed-tree-item.active .mixed-hover-action {
        opacity: 1;
      }
      .mixed-expand-button,
      .mixed-expand-spacer {
        flex: 0 0 32px;
      }
      .mixed-expand-button.mat-mdc-icon-button,
      .mixed-tree-actions .mat-mdc-icon-button {
        --mdc-icon-button-state-layer-size: 28px;
        height: 28px;
        padding: 2px;
        width: 28px;
      }
      .mixed-type-icon {
        align-items: center;
        display: inline-flex;
        flex: 0 0 28px;
        font-size: 20px;
        height: 24px;
        justify-content: center;
        width: 28px;
      }
      .mixed-tree-label {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mixed-rename-field {
        flex: 1 1 auto;
      }
      .mixed-tree-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        margin-left: 4px;
      }
      .mixed-hover-action {
        opacity: 0;
      }
      .mixed-splitter {
        background: rgba(0, 0, 0, 0.12);
        cursor: col-resize;
        flex: 0 0 6px;
      }
      .mixed-splitter.dragging {
        background: #3f51b5;
      }
      .mixed-detail-pane {
        flex: 1 1 auto;
        min-width: 0;
        padding: 16px;
      }
      .mixed-inline-detail {
        min-width: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    JsonFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTreeModule,
  ],
})
export class MixedRenderer extends JsonFormsControl {
  mixedRenderInfos: SchemaRenderInfo[] = [];
  selectedIndex: number | undefined;
  valueType: JsonDataType | null = null;
  activeNodeId = ROOT_TREE_NODE_ID;
  openedNodes = new Set<string>();
  treeNodes: MixedTreeNode[] = [];
  visibleTreeItems: VisibleTreeItem[] = [];
  selectedNode: MixedTreeNode | undefined;
  treeSearch = '';
  showPrimitivesInTree = false;
  renamingNodeId: string | null = null;
  renameValue = '';
  renameError: string | null = null;
  treeWidth = 320;
  treeExpanded = true;
  draggingSplitter = false;
  activeInfo: SchemaRenderInfo | undefined;
  showTreeView = false;
  isNestedComplexType = false;
  showInlineDetail = false;
  treeControl = new FlatTreeControl<VisibleTreeItem, string>(
    (item) => item.depth,
    (item) => item.hasChildren,
    {
      trackBy: (item) => item.node.nodeId,
    }
  );

  protected jsonFormsService = inject(JsonFormsAngularService);
  parentMixedRenderer = inject(MixedRenderer, {
    optional: true,
    skipSelf: true,
  });
  private treeControlCache = new Map<string, TreeNodeControl>();
  private treeStructureSignature: string | undefined;
  private treeSchemaIndex: number | undefined;

  mapAdditionalProps(props: StatePropsOfControl): void {
    const uischemas =
      this.jsonFormsService.getState().jsonforms.uischemas ?? [];
    this.valueType = getJsonDataType(this.data);
    this.mixedRenderInfos = createMixedRenderInfos(
      this.scopedSchema,
      this.rootSchema,
      this.uischema,
      this.propsPath,
      uischemas
    );
    this.selectedIndex = this.findMatchingInfo()?.index;
    this.activeInfo =
      this.selectedIndex !== undefined
        ? this.mixedRenderInfos[this.selectedIndex]
        : undefined;
    this.showTreeView =
      !this.parentMixedRenderer &&
      (this.valueType === 'object' || this.valueType === 'array');
    this.isNestedComplexType =
      Boolean(this.parentMixedRenderer) &&
      (this.valueType === 'object' || this.valueType === 'array');
    this.showInlineDetail =
      !this.showTreeView &&
      !this.isNestedComplexType &&
      Boolean(this.activeInfo) &&
      this.activeInfo?.resolvedSchema?.type !== 'null';

    if (this.showTreeView) {
      const nextStructureSignature = getTreeStructureSignature(
        this.data,
        this.showPrimitivesInTree
      );
      const nextSchemaIndex = this.activeInfo?.index;
      if (
        this.treeNodes.length === 0 ||
        this.treeStructureSignature !== nextStructureSignature ||
        this.treeSchemaIndex !== nextSchemaIndex
      ) {
        this.rebuildTree(nextStructureSignature, nextSchemaIndex);
      }
    } else {
      this.treeNodes = [];
      this.visibleTreeItems = [];
      this.selectedNode = undefined;
      this.treeStructureSignature = undefined;
      this.treeSchemaIndex = undefined;
    }

    if (props.errors) {
      this.error = props.errors;
    }
  }

  handleSelectChange(newIndex: number | undefined): void {
    const newData =
      newIndex !== undefined
        ? createDefaultValue(
            this.mixedRenderInfos[newIndex].resolvedSchema,
            this.rootSchema
          )
        : undefined;

    this.jsonFormsService.updateCore(
      Actions.update(this.propsPath, () => newData)
    );
    this.selectedIndex = newIndex;
    this.activeInfo =
      newIndex !== undefined ? this.mixedRenderInfos[newIndex] : undefined;
    this.valueType =
      newIndex !== undefined
        ? ((this.mixedRenderInfos[newIndex]?.resolvedSchema as JsonSchema7)
            ?.type as JsonDataType)
        : null;
    this.activeNodeId = toTreeNodeId(this.propsPath);
  }

  selectPath(targetPath: string): void {
    this.activeNodeId = toTreeNodeId(targetPath);
    this.getPathAncestorNodeIds(targetPath).forEach((nodeId) =>
      this.openedNodes.add(nodeId)
    );
    this.selectedNode = findNodeById(this.treeNodes, this.activeNodeId);
    this.rebuildVisibleTree();
  }

  selectNestedPath(): void {
    this.parentMixedRenderer?.selectPath(this.propsPath);
  }

  selectNode(nodeId: string): void {
    this.activeNodeId = nodeId;
    this.selectedNode = findNodeById(this.treeNodes, nodeId);
  }

  toggleNode(node: MixedTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    if (!node.children?.length) {
      return;
    }

    if (this.openedNodes.has(node.nodeId)) {
      this.openedNodes.delete(node.nodeId);
    } else {
      this.openedNodes.add(node.nodeId);
    }
    this.rebuildVisibleTree();
  }

  togglePrimitiveVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPrimitivesInTree = !this.showPrimitivesInTree;
    this.rebuildTree();
  }

  startRename(node: MixedTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    if (!node.canRename) {
      return;
    }
    this.renamingNodeId = node.nodeId;
    this.renameValue = node.label;
    this.renameError = null;
  }

  cancelRename(): void {
    this.renamingNodeId = null;
    this.renameValue = '';
    this.renameError = null;
  }

  commitRename(node: MixedTreeNode): void {
    if (this.renamingNodeId !== node.nodeId) {
      return;
    }

    const trimmed = this.renameValue.trim();
    if (!trimmed || trimmed === node.label) {
      this.cancelRename();
      return;
    }

    const parentPath = getParentPath(this.propsPath, node.control.path);
    const parentRelativePath = getRelativePath(this.propsPath, parentPath);
    const parentData =
      parentRelativePath === null
        ? this.data
        : get(this.data, parentRelativePath);

    if (
      typeof parentData !== 'object' ||
      parentData === null ||
      Array.isArray(parentData)
    ) {
      this.cancelRename();
      return;
    }

    if (trimmed in parentData) {
      this.renameError = `Property "${trimmed}" already exists`;
      return;
    }

    let parentSchema = this.getParentSchema(parentPath);
    if (parentSchema) {
      parentSchema = resolveSchema(parentSchema, this.rootSchema);
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
        this.renameError = `Property name must match pattern: ${patterns.join(
          ', '
        )}`;
        return;
      }
    }

    const propertyNames = (parentSchema as JsonSchema7)?.propertyNames as
      | JsonSchema7
      | undefined;
    if (propertyNames?.pattern) {
      const pattern = new RegExp(propertyNames.pattern);
      if (!pattern.test(trimmed)) {
        this.renameError = `Property name must match pattern: ${propertyNames.pattern}`;
        return;
      }
    }

    const updatedData = Object.fromEntries(
      Object.entries(parentData).map(([key, value]) => [
        key === node.label ? trimmed : key,
        value,
      ])
    );
    this.jsonFormsService.updateCore(
      Actions.update(parentPath, () => updatedData)
    );

    const newPath = compose(parentPath, trimmed);
    this.selectPath(newPath);
    this.cancelRename();
  }

  deleteNode(node: MixedTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    if (!node.canDelete) {
      return;
    }

    const parentPath = getParentPath(this.propsPath, node.control.path);
    const parentRelativePath = getRelativePath(this.propsPath, parentPath);
    const parentData =
      parentRelativePath === null
        ? this.data
        : get(this.data, parentRelativePath);
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
      this.jsonFormsService.updateCore(
        Actions.update(parentPath, () => updatedData)
      );
    } else if (typeof parentData === 'object' && parentData !== null) {
      const updatedData = { ...parentData };
      delete updatedData[key];
      this.jsonFormsService.updateCore(
        Actions.update(parentPath, () => updatedData)
      );
    }

    if (
      this.activeNodeId === node.nodeId ||
      this.activeNodeId.startsWith(`${node.nodeId}.`)
    ) {
      this.selectPath(parentPath);
    }
  }

  rebuildVisibleTree(): void {
    this.visibleTreeItems = flattenVisibleTree(
      this.treeNodes,
      this.openedNodes,
      0,
      this.treeSearch
    );
  }

  trackTreeItem(_index: number, item: VisibleTreeItem): string {
    return item.node.nodeId;
  }

  getTypeIcon(type: JsonDataType): string {
    switch (type) {
      case 'array':
        return 'format_list_bulleted';
      case 'object':
        return 'folder';
      case 'boolean':
        return 'toggle_on';
      case 'integer':
      case 'number':
        return 'pin';
      case 'string':
        return 'abc';
      case 'null':
      default:
        return 'add';
    }
  }

  startSplitterDrag(event: MouseEvent): void {
    event.preventDefault();
    this.draggingSplitter = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.draggingSplitter) {
      return;
    }
    this.treeWidth = Math.min(640, Math.max(220, event.clientX - 32));
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.draggingSplitter = false;
  }

  private findMatchingInfo(): SchemaRenderInfo | undefined {
    const currentlySelected =
      this.selectedIndex !== undefined
        ? this.mixedRenderInfos[this.selectedIndex]
        : undefined;
    if (
      currentlySelected &&
      schemaSupportsInputType(
        (currentlySelected.resolvedSchema as JsonSchema7).type,
        this.valueType
      )
    ) {
      return currentlySelected;
    }

    const exact = this.mixedRenderInfos.find(
      (entry) => (entry.resolvedSchema as JsonSchema7).type === this.valueType
    );
    return (
      exact ??
      this.mixedRenderInfos.find(
        (entry) =>
          (entry.resolvedSchema as JsonSchema7).type === 'number' &&
          this.valueType === 'integer'
      )
    );
  }

  private rebuildTree(
    structureSignature = getTreeStructureSignature(
      this.data,
      this.showPrimitivesInTree
    ),
    schemaIndex = this.activeInfo?.index
  ): void {
    this.treeNodes = buildTreeFromData(
      this.data,
      this.activeInfo?.resolvedSchema ?? this.scopedSchema,
      this.rootSchema,
      this.propsPath,
      this.label,
      this.showPrimitivesInTree,
      this.treeControlCache
    );
    this.treeStructureSignature = structureSignature;
    this.treeSchemaIndex = schemaIndex;

    const allNodeIds = flattenTree(this.treeNodes).map((node) => node.nodeId);
    const allNodeIdSet = new Set(allNodeIds);
    const rootNodeId = toTreeNodeId(this.propsPath);
    if (!allNodeIdSet.has(this.activeNodeId)) {
      this.activeNodeId = rootNodeId;
    }
    this.openedNodes = new Set(
      [rootNodeId, ...Array.from(this.openedNodes)].filter((nodeId) =>
        allNodeIdSet.has(nodeId)
      )
    );
    this.selectedNode = findNodeById(this.treeNodes, this.activeNodeId);
    this.rebuildVisibleTree();
  }

  private getPathAncestorNodeIds(targetPath: string): string[] {
    const relativePath = getRelativePath(this.propsPath, targetPath);
    const segments =
      relativePath === null ? [] : relativePath.split('.').filter(Boolean);
    const result = [toTreeNodeId(this.propsPath)];
    let currentPath = this.propsPath;

    segments.slice(0, -1).forEach((segment) => {
      currentPath = compose(currentPath, segment);
      result.push(toTreeNodeId(currentPath));
    });

    return result;
  }

  private getParentSchema(parentPath: string): JsonSchema | undefined {
    const parentRelativePath = getRelativePath(this.propsPath, parentPath);
    if (parentRelativePath === null) {
      return this.activeInfo?.resolvedSchema ?? this.scopedSchema;
    }

    const segments = parentRelativePath.split('.');
    let currentSchema: JsonSchema =
      this.activeInfo?.resolvedSchema ?? this.scopedSchema;

    for (const segment of segments) {
      currentSchema = resolveSchema(currentSchema, this.rootSchema);
      if (typeof currentSchema !== 'object') {
        return {};
      }
      if (currentSchema.type === 'array') {
        currentSchema = (currentSchema.items as JsonSchema) ?? {};
      } else {
        currentSchema =
          currentSchema.properties?.[segment] ??
          findPropertySchema(currentSchema, segment, this.rootSchema) ??
          {};
      }
    }

    return currentSchema;
  }
}

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
      const currentDataSchema = Resolve.schema(
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

export const isMixedControl = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext
) =>
  isMixedSchema(uischema as UISchemaElement & Scopable, schema, context) &&
  (isControl(uischema) || isDefaultGenUiSchema(uischema));

export const MixedRendererTester: RankedTester = rankWith(20, isMixedControl);
