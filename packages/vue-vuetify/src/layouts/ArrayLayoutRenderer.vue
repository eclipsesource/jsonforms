<template>
  <v-expansion-panels
    v-if="control.visible"
    :class="styles.arrayList.root"
    v-model="openedPanels"
    flat
    v-bind="vuetifyProps('v-expansion-panels')"
  >
    <v-expansion-panel hide-actions>
      <v-expansion-panel-title
        :class="`pa-0 ${styles.arrayList.title}`"
        v-bind="vuetifyProps('v-expansion-panel-title')"
      >
        <v-toolbar
          flat
          :class="styles.arrayList.toolbar"
          v-bind="vuetifyProps('v-toolbar')"
        >
          <v-toolbar-title :class="styles.arrayList.label">{{
            computedLabel
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex ga-1 align-center">
            <validation-icon
              v-if="
                control.childErrors.length > 0 &&
                !appliedOptions.hideArraySummaryValidation
              "
              :errors="control.childErrors"
              :class="styles.arrayList.validationIcon"
            />
            <slot
              name="toolbar-elements"
              :addClass="styles.arrayList.addButton"
              :addDisabled="addDisabled"
              :addClick="addButtonClick"
              :control="control"
              :appliedOptions="appliedOptions"
              :styles="styles"
              :icons="icons"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    variant="text"
                    elevation="0"
                    small
                    :aria-label="control.translations.addAriaLabel"
                    v-bind="props"
                    :class="styles.arrayList.addButton"
                    :disabled="addDisabled"
                    @click.stop="addButtonClick"
                  >
                    <v-icon>{{ icons.current.value.itemAdd }}</v-icon>
                  </v-btn>
                </template>
                {{ control.translations.addTooltip }}
              </v-tooltip>
            </slot>
            <v-btn icon variant="text" small @click.stop="togglePanel">
              <v-icon>
                {{ isSelected ? collapseIcon : expandIcon }}
              </v-icon>
            </v-btn>
          </div>
        </v-toolbar>
      </v-expansion-panel-title>
      <v-expansion-panel-text
        class="array-data-panel"
        v-bind="vuetifyProps('v-expansion-panel-text')"
      >
        <v-card :class="styles.arrayList.container" flat>
          <v-card-text v-if="dataLength > 0">
            <v-expansion-panels
              accordion
              v-bind="expansionPanelsProps"
              v-model="currentlyExpanded"
            >
              <v-expansion-panel
                v-for="(_element, index) in control.data"
                :key="`${control.path}-${control.data.length}-${index}`"
                :class="styles.arrayList.item"
              >
                <v-expansion-panel-title
                  :class="`${styles.arrayList.itemHeader} py-0`"
                >
                  <v-container
                    :class="`${styles.arrayList.itemContainer} py-0`"
                    fluid
                  >
                    <v-row
                      :style="`display: grid; grid-template-columns: ${
                        !hideAvatar ? 'min-content' : ''
                      } auto min-content ${
                        appliedOptions.showSortButtons
                          ? 'min-content min-content'
                          : ''
                      }`"
                    >
                      <v-col
                        v-if="!hideAvatar"
                        align-self="center"
                        class="pl-0"
                      >
                        <validation-badge
                          overlap
                          bordered
                          :errors="childErrors(index)"
                        >
                          <v-avatar
                            size="40"
                            aria-label="Index"
                            color="primary"
                          >
                            <span class="primary--text text--lighten-5">{{
                              index + 1
                            }}</span></v-avatar
                          >
                        </validation-badge>
                      </v-col>

                      <v-col
                        align-self="center"
                        :class="`pl-0 text-truncate ${styles.arrayList.itemLabel}`"
                        >{{ childLabelForIndex(index) }}</v-col
                      >
                      <v-col
                        align-self="center"
                        v-if="appliedOptions.showSortButtons"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              variant="text"
                              elevation="0"
                              small
                              class="v-expansion-panel-title__icon"
                              :aria-label="control.translations.upAriaLabel"
                              :disabled="index <= 0 || !control.enabled"
                              :class="styles.arrayList.itemMoveUp"
                              @click.stop="moveUpClick($event, index)"
                            >
                              <v-icon class="notranslate">{{
                                icons.current.value.itemMoveUp
                              }}</v-icon>
                            </v-btn>
                          </template>
                          {{ control.translations.up }}
                        </v-tooltip>
                      </v-col>
                      <v-col
                        align-self="center"
                        v-if="appliedOptions.showSortButtons"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              variant="text"
                              elevation="0"
                              small
                              class="v-expansion-panel-title__icon"
                              :aria-label="control.translations.downAriaLabel"
                              :disabled="
                                index >= dataLength - 1 || !control.enabled
                              "
                              :class="styles.arrayList.itemMoveDown"
                              @click.stop="moveDownClick($event, index)"
                            >
                              <v-icon class="notranslate">{{
                                icons.current.value.itemMoveDown
                              }}</v-icon>
                            </v-btn>
                          </template>
                          {{ control.translations.down }}
                        </v-tooltip>
                      </v-col>
                      <v-col align-self="center">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              variant="text"
                              elevation="0"
                              small
                              class="v-expansion-panel-title__icon"
                              :aria-label="control.translations.removeAriaLabel"
                              :class="styles.arrayList.itemDelete"
                              :disabled="
                                !control.enabled ||
                                (appliedOptions.restrict &&
                                  control.arraySchema !== undefined &&
                                  control.arraySchema.minItems !== undefined &&
                                  dataLength <= control.arraySchema.minItems)
                              "
                              @click.stop="suggestToDelete = index"
                            >
                              <v-icon class="notranslate">{{
                                icons.current.value.itemDelete
                              }}</v-icon>
                            </v-btn>
                          </template>
                          {{ control.translations.removeTooltip }}
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-title>
                <v-expansion-panel-text :class="styles.arrayList.itemContent">
                  <dispatch-renderer
                    :schema="control.schema"
                    :uischema="foundUISchema"
                    :path="composePaths(control.path, `${index}`)"
                    :enabled="control.enabled"
                    :renderers="control.renderers"
                    :cells="control.cells"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>

          <v-card-text v-else :class="styles.arrayList.noData">
            {{ control.translations.noDataMessage }}
          </v-card-text>

          <v-card-actions
            v-if="$slots.actions"
            class="pb-8"
            @click.stop
            v-bind="vuetifyProps('v-card-actions')"
          >
            <slot
              name="actions"
              :addClass="styles.arrayList.addButton"
              :addDisabled="addDisabled"
              :addClick="addButtonClick"
              :control="control"
              :appliedOptions="appliedOptions"
              :styles="styles"
              :icons="icons"
            >
            </slot>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-text>
      <v-dialog
        :model-value="suggestToDelete !== null"
        max-width="600"
        @keydown.esc="suggestToDelete = null"
        @click:outside="suggestToDelete = null"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{ control.translations.deleteDialogTitle }}
          </v-card-title>

          <v-card-text>
            {{ control.translations.deleteDialogMessage }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn variant="text" @click="suggestToDelete = null">
              {{ control.translations.deleteDialogDecline }}</v-btn
            >
            <v-btn
              variant="text"
              ref="confirm"
              @click="
                removeItemsClick(
                  suggestToDelete === null ? null : [suggestToDelete],
                );
                suggestToDelete = null;
              "
            >
              {{ control.translations.deleteDialogAccept }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import type { IconValue } from '@/icons';
import {
  composePaths,
  createDefaultValue,
  findUISchema,
  getControlPath,
  type ControlElement,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  type RendererProps,
} from '@jsonforms/vue';
import type { ErrorObject } from 'ajv';
import merge from 'lodash/merge';
import { computed, defineComponent, ref } from 'vue';
import {
  VAvatar,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCol,
  VContainer,
  VDialog,
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
  VIcon,
  VRow,
  VSpacer,
  VToolbar,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/components';
import { ValidationBadge, ValidationIcon } from '../controls/components/index';
import { useIcons, useNested, useVuetifyArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'array-layout-renderer',
  components: {
    DispatchRenderer,
    VAvatar,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VRow,
    VCol,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VIcon,
    VBtn,
    VSpacer,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VContainer,
    ValidationIcon,
    ValidationBadge,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useVuetifyArrayControl(useJsonFormsArrayControl(props));
    const currentlyExpanded = ref<null | number>(
      control.appliedOptions.value.initCollapsed ? null : 0,
    );
    const expansionPanelsProps = computed(() =>
      merge(
        { flat: false, focusable: true },
        control.vuetifyProps('v-expansion-panels'),
      ),
    );
    const suggestToDelete = ref<null | number>(null);
    // indicate to our child renderers that we are increasing the "nested" level
    useNested('array');

    const icons = useIcons();
    const openedPanels = ref<number | number[] | null>(0);

    return {
      ...control,
      openedPanels,
      currentlyExpanded,
      expansionPanelsProps,
      suggestToDelete,
      icons,
    };
  },
  computed: {
    isSelected(): boolean {
      return Array.isArray(this.openedPanels)
        ? this.openedPanels.includes(0)
        : this.openedPanels === 0;
    },
    expandIcon(): IconValue {
      return (
        this.vuetifyProps('v-expansion-panel-title').expandIcon ?? '$expand'
      );
    },
    collapseIcon(): IconValue {
      return (
        this.vuetifyProps('v-expansion-panel-title').collapseIcon ?? '$collapse'
      );
    },
    addDisabled(): boolean {
      return (
        !this.control.enabled ||
        (this.appliedOptions.restrict &&
          this.control.arraySchema !== undefined &&
          this.control.arraySchema.maxItems !== undefined &&
          this.dataLength >= this.control.arraySchema.maxItems)
      );
    },
    dataLength(): number {
      return this.control.data ? this.control.data.length : 0;
    },
    foundUISchema(): UISchemaElement {
      return findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        undefined,
        this.control.uischema,
        this.control.rootSchema,
      );
    },
    hideAvatar(): boolean {
      return !!this.appliedOptions.hideAvatar;
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    togglePanel() {
      this.openedPanels = this.isSelected ? null : 0;
    },
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema),
      )();
      if (!this.appliedOptions.collapseNewItems && this.control.data?.length) {
        this.currentlyExpanded = this.dataLength - 1;
      }
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    removeItemsClick(toDelete: number[] | null): void {
      if (toDelete !== null) {
        this.removeItems?.(this.control.path, toDelete)();
      }
    },
    childErrors(index: number): ErrorObject[] {
      return this.control.childErrors.filter((e) => {
        const errorDataPath = getControlPath(e);
        return errorDataPath.startsWith(
          this.composePaths(this.control.path, `${index}`),
        );
      });
    },
  },
});

export default controlRenderer;
</script>

<style scoped>
:deep(
    .v-expansion-panel-text.array-data-panel > .v-expansion-panel-text__wrapper
  ) {
  padding: 0;
}

.notranslate {
  transform: none !important;
}

:deep(.v-toolbar__content) {
  padding-left: 0;
}
</style>
