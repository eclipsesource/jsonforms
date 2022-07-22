<template>
  <v-container
    v-if="control.visible"
    fill-height
    :class="styles.listWithDetail.root"
  >
    <v-row>
      <v-col class="pa-0">
        <v-toolbar flat :class="styles.listWithDetail.toolbar">
          <v-toolbar-title :class="styles.listWithDetail.label">{{
            computedLabel
          }}</v-toolbar-title>
          <validation-icon
            v-if="control.childErrors.length > 0"
            :errors="control.childErrors"
          />
          <v-spacer></v-spacer>

          <v-tooltip bottom>
            <template v-slot:activator="{ on: onTooltip }">
              <v-btn
                fab
                text
                elevation="0"
                small
                :aria-label="`Add to ${control.label}`"
                v-on="onTooltip"
                :class="styles.listWithDetail.addButton"
                @click="addButtonClick"
                :disabled="
                  !control.enabled ||
                  (appliedOptions.restrict &&
                    arraySchema !== undefined &&
                    arraySchema.maxItems !== undefined &&
                    control.data.length >= arraySchema.maxItems)
                "
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            {{ `Add to ${control.label}` }}
          </v-tooltip>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row v-if="noData" :class="styles.listWithDetail.noData">
      <v-col>No data</v-col>
    </v-row>
    <v-row v-else>
      <v-col class="shrink pa-0">
        <v-list-item-group v-model="selectedIndex">
          <v-virtual-scroll
            :items="control.data"
            :item-height="64"
            bench="4"
            :min-height="`${4 * 64}`"
            :max-height="`${6 * 64}`"
            :min-width="appliedOptions.showSortButtons ? 350 : 250"
            max-width="350"
          >
            <template v-slot="{ index }">
              <v-list-item
                dense
                :value="index"
                :class="styles.listWithDetail.item"
              >
                <v-list-item-avatar
                  aria-label="Index"
                  size="64"
                  class="ma-0"
                  tile
                  color="rgba(0,0,0,0)"
                >
                  <validation-badge
                    overlap
                    bordered
                    :errors="childErrors(index)"
                  >
                    <v-avatar size="40" aria-label="Index" color="info"
                      ><span class="info--text text--lighten-5">{{
                        index + 1
                      }}</span></v-avatar
                    >
                  </validation-badge>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: onTooltip }">
                        <span
                          v-on="onTooltip"
                          :class="styles.listWithDetail.itemLabel"
                        >
                          {{ childLabelForIndex(index) }}</span
                        >
                      </template>
                      {{ childLabelForIndex(index) }}
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="appliedOptions.showSortButtons">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn
                        v-on="onTooltip"
                        fab
                        text
                        elevation="0"
                        small
                        class="ma-0"
                        aria-label="Move up"
                        :disabled="index <= 0 || !control.enabled"
                        :class="styles.listWithDetail.itemMoveUp"
                        @click.native="moveUpClick($event, index)"
                      >
                        <v-icon class="notranslate">mdi-arrow-up</v-icon>
                      </v-btn>
                    </template>
                    Move Up
                  </v-tooltip>
                </v-list-item-action>
                <v-list-item-action v-if="appliedOptions.showSortButtons">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn
                        v-on="onTooltip"
                        fab
                        text
                        elevation="0"
                        small
                        class="ma-0"
                        aria-label="Move down"
                        :disabled="
                          index >= control.data.length - 1 || !control.enabled
                        "
                        :class="styles.listWithDetail.itemMoveDown"
                        @click.native="moveDownClick($event, index)"
                      >
                        <v-icon class="notranslate">mdi-arrow-down</v-icon>
                      </v-btn>
                    </template>
                    Move Down
                  </v-tooltip>
                </v-list-item-action>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn
                        v-on="onTooltip"
                        fab
                        text
                        elevation="0"
                        small
                        class="ma-0"
                        aria-label="Delete"
                        :class="styles.listWithDetail.itemDelete"
                        @click.native="removeItemsClick($event, [index])"
                        :disabled="
                          !control.enabled ||
                          (appliedOptions.restrict &&
                            arraySchema !== undefined &&
                            arraySchema.minItems !== undefined &&
                            control.data.length <= arraySchema.minItems)
                        "
                      >
                        <v-icon class="notranslate">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    Delete
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-col>
      <v-col v-if="selectedIndex === undefined" class="grow">
        <span class="text-h6">No Selection</span>
      </v-col>
      <v-col v-else :class="`grow ${styles.listWithDetail.itemContent}`">
        <dispatch-renderer
          :schema="control.schema"
          :uischema="foundUISchema"
          :path="composePaths(control.path, `${selectedIndex}`)"
          :enabled="control.enabled"
          :renderers="control.renderers"
          :cells="control.cells"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  ControlElement,
  rankWith,
  composePaths,
  createDefaultValue,
  and,
  uiTypeIs,
  isObjectArray,
  findUISchema,
  UISchemaElement,
  Resolve,
  JsonSchema,
} from '@jsonforms/core';
import { defineComponent, ref } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsArrayControl,
} from '@jsonforms/vue2';
import { useVuetifyArrayControl } from '../util';
import {
  VList,
  VListItemGroup,
  VListItem,
  VListItemTitle,
  VListItemContent,
  VListItemAction,
  VListItemAvatar,
  VRow,
  VCol,
  VContainer,
  VToolbar,
  VToolbarTitle,
  VTooltip,
  VIcon,
  VBtn,
  VAvatar,
  VSpacer,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelHeader,
  VExpansionPanelContent,
  VVirtualScroll,
} from 'vuetify/lib';
import { ValidationIcon, ValidationBadge } from '../controls/components/index';
import { ErrorObject } from 'ajv';

const controlRenderer = defineComponent({
  name: 'list-with-detail-renderer',
  components: {
    DispatchRenderer,
    VList,
    VListItemGroup,
    VListItem,
    VListItemTitle,
    VListItemContent,
    VListItemAction,
    VListItemAvatar,
    VAvatar,
    VRow,
    VCol,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VBtn,
    VIcon,
    VSpacer,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent,
    VContainer,
    VVirtualScroll,
    ValidationIcon,
    ValidationBadge,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const selectedIndex = ref<number | undefined>(undefined);

    return {
      ...useVuetifyArrayControl(useJsonFormsArrayControl(props)),
      selectedIndex,
    };
  },
  computed: {
    noData(): boolean {
      return !this.control.data || this.control.data.length === 0;
    },
    foundUISchema(): UISchemaElement {
      return findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        undefined,
        this.control.uischema
      );
    },
    arraySchema(): JsonSchema | undefined {
      return Resolve.schema(
        this.control.rootSchema,
        this.control.uischema.scope,
        this.control.rootSchema
      );
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema)
      )();
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    removeItemsClick(event: Event, toDelete: number[]): void {
      event.stopPropagation();
      this.removeItems?.(this.control.path, toDelete)();
    },
    childErrors(index: number): ErrorObject[] {
      return this.control.childErrors.filter((e) =>
        e.instancePath.startsWith(
          this.composePaths(this.control.path, `${index}`)
        )
      );
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, and(uiTypeIs('ListWithDetail'), isObjectArray)),
};
</script>

<style scoped>
.notranslate {
  transform: none !important;
}
</style>
