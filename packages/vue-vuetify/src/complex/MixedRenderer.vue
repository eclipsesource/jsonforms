<template>
  <div v-if="control.visible" class="mixed-renderer">
    <template v-if="showTreeView">
      <v-expansion-panels v-model="currentlyExpanded" flat>
        <v-expansion-panel value="mixed-details">
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
                    :clearable="canClearType"
                    :item-title="
                      (item: SchemaRenderInfo) => t(item.label, item.label)
                    "
                    item-value="index"
                    :model-value="selectedIndex"
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
                      :label="mixedTranslations.searchLabel"
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
                          hide-details="auto"
                          autofocus
                          :error-messages="renameError ? [renameError] : []"
                          v-bind="vuetifyProps('v-text-field')"
                          @update:model-value="updateRenameError(item)"
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
                                :aria-label="
                                  showPrimitivesInTree
                                    ? mixedTranslations.hidePrimitives
                                    : mixedTranslations.showPrimitives
                                "
                                @click.stop="toggleShowPrimitives"
                              />
                            </template>
                            <span>
                              {{
                                showPrimitivesInTree
                                  ? mixedTranslations.hidePrimitives
                                  : mixedTranslations.showPrimitives
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
                                  :aria-label="
                                    mixedTranslations.renameAriaLabel(
                                      item.label,
                                    )
                                  "
                                  variant="text"
                                  size="x-small"
                                  @click.stop="startRename(item)"
                                />
                              </template>
                              <span>{{ mixedTranslations.renameTooltip }}</span>
                            </v-tooltip>
                            <v-tooltip v-if="item.canDelete" location="top">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="mixed-tree-action mixed-hover-action"
                                  :icon="icons.current.value.itemDelete"
                                  :aria-label="
                                    mixedTranslations.deleteAriaLabel(
                                      item.label,
                                    )
                                  "
                                  variant="text"
                                  size="x-small"
                                  color="error"
                                  @click.stop="deleteNode(item)"
                                />
                              </template>
                              <span>{{ mixedTranslations.deleteTooltip }}</span>
                            </v-tooltip>
                          </template>
                        </div>
                      </template>
                    </v-treeview>
                  </div>
                </v-pane>

                <v-pane min-size="35" size="75">
                  <div class="mixed-detail-pane">
                    <template
                      v-if="selectedNode?.uneditableValue !== undefined"
                    >
                      <p>{{ mixedTranslations.unsupportedPropertyName }}</p>
                      <pre>{{ selectedNode.uneditableValue }}</pre>
                    </template>
                    <dispatch-renderer
                      v-if="
                        selectedNode &&
                        selectedNode.uneditableValue === undefined
                      "
                      :key="selectedNode.nodeId"
                      :schema="selectedNodeEditor.schema"
                      :uischema="selectedNodeEditor.uischema"
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
          :clearable="canClearType"
          :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
          item-value="index"
          :model-value="selectedIndex"
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
              :aria-label="mixedTranslations.viewAriaLabel(computedLabel)"
              variant="text"
              color="primary"
              @click="selectCurrentPath"
            />
          </template>
          <span>{{ mixedTranslations.viewTooltip(computedLabel) }}</span>
        </v-tooltip>
      </div>
    </template>

    <template v-else>
      <div
        :class="
          isSelectedComplexType ? 'mixed-selected-complex' : 'mixed-primitive'
        "
      >
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
          :clearable="canClearType"
          :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
          item-value="index"
          :model-value="selectedIndex"
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
    <v-dialog
      :aria-label="t('mixedRenderer.confirmDeleteTitle', 'Delete item?')"
      :model-value="pendingDeleteNode !== null"
      max-width="480"
      @update:model-value="pendingDeleteNode = null"
    >
      <v-card :title="t('mixedRenderer.confirmDeleteTitle', 'Delete item?')">
        <v-card-text>
          {{
            t(
              'mixedRenderer.confirmDeleteMessage',
              'This will delete the selected item and all its nested content.',
            )
          }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="pendingDeleteNode = null">{{
            t('mixedRenderer.cancelDelete', 'Cancel')
          }}</v-btn>
          <v-btn
            class="mixed-confirm-delete"
            color="error"
            @click="confirmDelete"
          >
            {{ mixedTranslations.deleteTooltip }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { AdditionalPropertiesTranslationEnum } from '@/i18n';
import { additionalPropertiesDefaultTranslations } from '@/i18n/additionalPropertiesTranslations';
import {
  getAdditionalPropertyTranslation,
  getMixedRendererTranslations,
} from '@/i18n/i18nUtil';
import {
  createDefaultValue,
  findUISchema,
  isControl,
  toDataPath,
  type UISchemaElement,
  type Layout,
  getI18nKeyPrefix,
  resolveData,
  type ControlElement,
  type JsonSchema,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useAjv,
  useJsonForms,
  useJsonFormsControl,
  useTranslator,
  type RendererProps,
} from '@jsonforms/vue';
import type { ErrorObject } from 'ajv';
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  watch,
  type DefineComponent,
  type InjectionKey,
  type ComputedRef,
} from 'vue';
import {
  VBtn,
  VDialog,
  VCard,
  VCardText,
  VCardActions,
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
  composePropertyPath,
  getDynamicPropertyNameErrorMessage,
  getPathAncestorPaths,
  getPropertyNameSchema,
  validateDynamicPropertyName,
} from '../util/dynamicProperties';
import {
  IsDynamicPropertyContext,
  isControlEditable,
  useCombinatorTranslations,
  useIcons,
  useVuetifyControl,
} from '../util';
import {
  buildTreeFromData,
  createMixedRenderInfos,
  findNodeById,
  flattenTree,
  getJsonDataType,
  resolveSchema,
  schemaSupportsInputType,
  toTreeNodeId,
  type JsonDataType,
  type MixedTreeNode,
  type SchemaRenderInfo,
} from '../util/mixedTree';

interface NavigationContext {
  selectPath: (path: string) => void;
  selectedPath: ComputedRef<string | undefined>;
}

const NavigationContextSymbol: InjectionKey<NavigationContext> = Symbol.for(
  'jsonforms-vue-vuetify:MixedRendererNavigationContext',
);

const controlRenderer = defineComponent({
  name: 'mixed-renderer',
  components: {
    DispatchRenderer,
    VBtn,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
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
    const path = computed(() => props.path);
    const input = useJsonFormsControl(props);
    const vuetifyControl = useCombinatorTranslations(useVuetifyControl(input));
    const valueType = ref(getJsonDataType(input.control.value.data));
    const jsonforms = useJsonForms();
    const ajv = useAjv();
    const icons = useIcons();
    const t = useTranslator();
    const navigationContext = inject(NavigationContextSymbol, undefined);
    const isRoot = !navigationContext;
    const activeNodeId = ref(toTreeNodeId(input.control.value.path));
    const openedNodes = ref<string[]>([]);
    const treeSearch = ref('');
    const currentlyExpanded = ref<string | null>('mixed-details');
    const showPrimitivesInTree = ref(false);
    const pendingDeleteNode = ref<MixedTreeNode | null>(null);
    const renamingNodeId = ref<string | null>(null);
    const renameValue = ref('');
    let renameTarget: unknown;
    let renameTargetPath: string | undefined;
    const renameError = ref<string | null>(null);
    const i18nAdditionalPropertiesPrefix = getI18nKeyPrefix(
      input.control.value.schema,
      input.control.value.uischema,
      input.control.value.path + '.additionalProperties',
    );
    const translateAdditionalProperty = (
      key: AdditionalPropertiesTranslationEnum,
      propertyName: string,
    ) =>
      getAdditionalPropertyTranslation(
        t.value,
        additionalPropertiesDefaultTranslations,
        i18nAdditionalPropertiesPrefix,
        key,
        propertyName,
      );
    const i18nMixedRendererPrefix = getI18nKeyPrefix(
      input.control.value.schema,
      input.control.value.uischema,
      input.control.value.path + '.mixedRenderer',
    );
    const mixedTranslations = getMixedRendererTranslations(
      t.value,
      i18nMixedRendererPrefix,
    );
    const translatePropertyNameSchemaError = (error: ErrorObject) =>
      jsonforms.i18n?.translateError?.(
        error,
        t.value,
        input.control.value.uischema,
      ) ??
      error.message ??
      translateAdditionalProperty(
        AdditionalPropertiesTranslationEnum.propertyNameInvalid,
        renameValue.value,
      );

    const mixedRenderInfos = computed<
      (SchemaRenderInfo & {
        index: number;
      })[]
    >(() => {
      const control = input.control.value;
      const result = createMixedRenderInfos(
        props.schema,
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

    const isSelectedComplexType = computed(
      () =>
        !isRoot &&
        navigationContext?.selectedPath.value === input.control.value.path &&
        (valueType.value === 'object' || valueType.value === 'array'),
    );

    const isArrayItem = computed(() => {
      const currentPath = input.control.value.path;
      if (!currentPath) return false;
      const parentPath = currentPath.includes('.')
        ? currentPath.slice(0, currentPath.lastIndexOf('.'))
        : '';
      return Array.isArray(resolveData(jsonforms.core?.data, parentPath));
    });
    const canClearType = computed(
      () => isControlEditable(input.control.value) && !isArrayItem.value,
    );

    const isNestedComplexType = computed(
      () =>
        !isRoot &&
        !isSelectedComplexType.value &&
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

    const allTreeNodes = computed(() =>
      showTreeView.value
        ? buildTreeFromData(
            input.control.value.data,
            resolvedSchema.value ?? input.control.value.schema,
            input.control.value.rootSchema,
            input.control.value.path,
            vuetifyControl.computedLabel.value,
            input.control.value.enabled,
            input.control.value.readonly,
            true,
            mixedTranslations.itemLabel,
            !!vuetifyControl.appliedOptions.value.restrict,
          )
        : [],
    );

    // Presentation filters must not determine whether the selected data exists.
    // Keep the full tree for editing/selection, and hide leaves only in the view.
    const treeNodes = computed(() => {
      if (showPrimitivesInTree.value) return allTreeNodes.value;
      const complexNodes = (nodes: MixedTreeNode[]): MixedTreeNode[] =>
        nodes
          .filter(
            (node) => node.jsonType === 'object' || node.jsonType === 'array',
          )
          .map((node) => {
            const children = complexNodes(node.children ?? []);
            const rest = { ...node };
            delete rest.children;
            return children.length ? { ...rest, children } : rest;
          });
      return complexNodes(allTreeNodes.value);
    });

    const selectedNode = computed(() =>
      findNodeById(allTreeNodes.value, activeNodeId.value),
    );

    const findDetailControl = (
      ui: UISchemaElement,
      relativePath: string,
    ): ControlElement | undefined => {
      if (isControl(ui) && toDataPath(ui.scope) === relativePath) return ui;
      for (const element of (ui as Layout).elements ?? []) {
        const found = findDetailControl(element, relativePath);
        if (found) return found;
      }
      return undefined;
    };

    const nodeUISchema = (node: MixedTreeNode): ControlElement => {
      if (node.control.path === input.control.value.path) {
        return { ...input.control.value.uischema, scope: '#' };
      }
      // Resolve authored controls even when their ancestor forms have never
      // been visited. Navigation must not replace their detail/options with a
      // generated Control merely because the tree was used to reach them.
      const ancestors = getPathAncestorPaths(
        input.control.value.path,
        node.control.path,
      ).reverse();
      for (const ancestorPath of ancestors) {
        const ancestor = findNodeById(
          allTreeNodes.value,
          toTreeNodeId(ancestorPath),
        );
        if (!ancestor) continue;
        const control = nodeUISchema(ancestor);
        const detail =
          control.options?.[`${ancestor.jsonType}-detail`] ??
          control.options?.detail;
        const ui = findUISchema(
          jsonforms.uischemas ?? [],
          ancestor.control.schema,
          control.scope,
          ancestorPath,
          'VerticalLayout',
          { ...control, options: { ...control.options, detail } },
          input.control.value.rootSchema,
        );
        const relativePath = node.control.path.slice(
          ancestorPath ? ancestorPath.length + 1 : 0,
        );
        const authored = findDetailControl(ui, relativePath);
        if (authored) return { ...authored, scope: '#' };
      }
      return node.control.uischema;
    };

    const selectedNodeEditor = computed(() => {
      const node = selectedNode.value!;
      if (node.control.path === input.control.value.path) {
        const detail = uischema.value ?? input.control.value.uischema;
        return {
          schema: node.control.schema,
          uischema:
            detail.type === 'Control' ? { ...detail, scope: '#' } : detail,
        };
      }
      return { schema: node.editorSchema, uischema: nodeUISchema(node) };
    });

    const activatedTreeNodes = computed<string[]>({
      get: () => [activeNodeId.value],
      set: (value) => {
        const nodeId = value[0];
        if (nodeId && findNodeById(allTreeNodes.value, nodeId)) {
          activeNodeId.value = nodeId;
        }
      },
    });

    const getPathAncestorNodeIds = (path: string): string[] => {
      return getPathAncestorPaths(input.control.value.path, path).map(
        toTreeNodeId,
      );
    };

    const selectPath = (path: string) => {
      const nodeId = toTreeNodeId(path);
      activeNodeId.value = nodeId;
      openedNodes.value = Array.from(
        new Set([...openedNodes.value, ...getPathAncestorNodeIds(path)]),
      );
    };

    if (isRoot) {
      provide(NavigationContextSymbol, {
        selectPath,
        selectedPath: computed(() => selectedNode.value?.control.path),
      });
    }

    watch(
      () => input.control.value.data,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          pendingDeleteNode.value = null;
          cancelRename();
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
      allTreeNodes,
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

    watch(
      () => input.control.value.path,
      () => cancelRename(),
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

    // Tree construction already resolves properties, patterns, references and
    // tuple items. Reuse that schema rather than walking the path a second time.
    const getParentSchema = (parentPath: string): JsonSchema | undefined =>
      findNodeById(allTreeNodes.value, toTreeNodeId(parentPath))?.control
        .schema;

    const toggleShowPrimitives = () => {
      showPrimitivesInTree.value = !showPrimitivesInTree.value;
    };

    const startRename = (node: MixedTreeNode) => {
      if (!findNodeById(allTreeNodes.value, node.nodeId)?.canRename) {
        return;
      }
      renameTarget = input.control.value.data;
      renameTargetPath = input.control.value.path;
      renamingNodeId.value = node.nodeId;
      renameValue.value = node.label;
      renameError.value = null;
    };

    const cancelRename = () => {
      renamingNodeId.value = null;
      renameValue.value = '';
      renameError.value = null;
    };

    const validateRename = (node: MixedTreeNode): string | null => {
      const propertyName = renameValue.value.trim();
      const parentPath = getParentPath(node.control.path);
      const parentRelativePath = getRelativePath(parentPath);
      const parentData =
        parentRelativePath === null
          ? input.control.value.data
          : resolveData(input.control.value.data, parentRelativePath);
      const parentSchema = getParentSchema(parentPath);
      const resolvedParentSchema = parentSchema
        ? resolveSchema(parentSchema, input.control.value.rootSchema)
        : {};
      const validationError = validateDynamicPropertyName({
        propertyName,
        currentPropertyName: node.label,
        reservedPropertyNames: Object.keys(
          resolvedParentSchema.properties ?? {},
        ),
        data: parentData,
        propertyNameSchema: getPropertyNameSchema(
          resolvedParentSchema,
          input.control.value.rootSchema,
        ),
        ajv,
      });

      return getDynamicPropertyNameErrorMessage(validationError, {
        alreadyDefined: translateAdditionalProperty(
          AdditionalPropertiesTranslationEnum.propertyAlreadyDefined,
          propertyName,
        ),
        invalid: translateAdditionalProperty(
          AdditionalPropertiesTranslationEnum.propertyNameInvalid,
          propertyName,
        ),
        schema: translatePropertyNameSchemaError,
      });
    };

    const updateRenameError = (node: MixedTreeNode) => {
      renameError.value = validateRename(node);
    };

    const commitRename = (node: MixedTreeNode) => {
      if (
        renamingNodeId.value !== node.nodeId ||
        renameTarget !== input.control.value.data ||
        renameTargetPath !== input.control.value.path
      ) {
        return;
      }
      if (!findNodeById(allTreeNodes.value, node.nodeId)?.canRename) {
        cancelRename();
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
          : resolveData(input.control.value.data, parentRelativePath);

      if (
        typeof parentData !== 'object' ||
        parentData === null ||
        Array.isArray(parentData)
      ) {
        cancelRename();
        return;
      }

      renameError.value = validateRename(node);
      if (renameError.value) {
        return;
      }

      const updatedData = Object.fromEntries(
        Object.entries(parentData).map(([key, value]) => [
          key === node.label ? trimmed : key,
          value,
        ]),
      );
      vuetifyControl.handleChange(parentPath, updatedData);

      const newPath = composePropertyPath(parentPath, trimmed);
      selectPath(newPath);
      cancelRename();
    };

    const commitDelete = (node: MixedTreeNode) => {
      // Recheck current eligibility: restrictions or readonly may have changed
      // while the confirmation dialog was open.
      const currentNode = findNodeById(allTreeNodes.value, node.nodeId);
      if (!currentNode?.canDelete || !isControlEditable(input.control.value)) {
        return;
      }

      const parentPath = getParentPath(node.control.path);
      const parentRelativePath = getRelativePath(parentPath);
      const parentData =
        parentRelativePath === null
          ? input.control.value.data
          : resolveData(input.control.value.data, parentRelativePath);
      const key = node.control.path.slice(
        parentPath.length ? parentPath.length + 1 : 0,
      );

      const selectedPath = selectedNode.value?.control.path;

      if (Array.isArray(parentData)) {
        const index = Number(key);
        if (!Number.isInteger(index)) {
          return;
        }
        const updatedData = [...parentData];
        updatedData.splice(index, 1);
        vuetifyControl.handleChange(parentPath, updatedData);
        // A splice changes the paths of later siblings and their descendants.
        // Preserve the selected value by shifting only this array's index segment.
        const prefix = parentPath ? `${parentPath}.` : '';
        if (selectedPath !== undefined && selectedPath.startsWith(prefix)) {
          const segments = selectedPath.slice(prefix.length).split('.');
          const selectedArrayIndex = Number(segments[0]);
          if (
            Number.isInteger(selectedArrayIndex) &&
            selectedArrayIndex > index
          ) {
            segments[0] = `${selectedArrayIndex - 1}`;
            selectPath(`${prefix}${segments.join('.')}`);
            return;
          }
        }
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

    const deleteNode = (node: MixedTreeNode) => {
      const currentNode = findNodeById(allTreeNodes.value, node.nodeId);
      if (!currentNode?.canDelete || !isControlEditable(input.control.value))
        return;
      const relativePath = getRelativePath(currentNode.control.path);
      const value =
        relativePath === null
          ? input.control.value.data
          : resolveData(input.control.value.data, relativePath);
      if (
        value !== null &&
        typeof value === 'object' &&
        Object.keys(value).length > 0
      ) {
        pendingDeleteNode.value = currentNode;
      } else {
        commitDelete(currentNode);
      }
    };

    const confirmDelete = () => {
      const node = pendingDeleteNode.value;
      pendingDeleteNode.value = null;
      if (node) commitDelete(node);
    };

    const handleSelectChange = (newIndex: number | null | undefined): void => {
      if (
        !isControlEditable(input.control.value) ||
        (newIndex == null && !canClearType.value) ||
        newIndex === selectedIndex.value
      )
        return;
      if (newIndex != null && !mixedRenderInfos.value[newIndex]) return;
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
      currentlyExpanded.value =
        type === 'object' || type === 'array' ? 'mixed-details' : null;
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
      selectedNodeEditor,
      isSelectedComplexType,
      canClearType,
      activatedTreeNodes,
      activeNodeId,
      openedNodes,
      treeSearch,
      showPrimitivesInTree,
      renamingNodeId,
      renameValue,
      renameError,
      mixedTranslations,
      toggleShowPrimitives,
      startRename,
      cancelRename,
      updateRenameError,
      commitRename,
      deleteNode,
      pendingDeleteNode,
      confirmDelete,
      handleSelectChange,
      selectCurrentPath,
      getTypeIcon,
    };
  },
}) as DefineComponent<any, any, any>;

export default controlRenderer;
</script>

<style scoped>
.mixed-renderer {
  width: 100%;
}

.mixed-selected-complex {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mixed-selected-complex > * {
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
