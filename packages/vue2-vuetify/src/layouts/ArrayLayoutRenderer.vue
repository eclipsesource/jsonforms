<template>
  <v-card v-if="control.visible" :class="styles.arrayList.root">
    <v-card-title>
      <v-toolbar flat :class="styles.arrayList.toolbar">
        <v-toolbar-title :class="styles.arrayList.label">{{
          computedLabel
        }}</v-toolbar-title>
        <validation-icon
          v-if="
            control.childErrors.length > 0 &&
            !appliedOptions.hideArraySummaryValidation
          "
          :errors="control.childErrors"
          :class="styles.arrayList.validationIcon"
        />
        <v-spacer></v-spacer>
        <slot
          name="toolbar-elements"
          :labels="translatedLabels"
          :addClass="styles.arrayList.addButton"
          :addDisabled="addDisabled"
          :addClick="addButtonClick"
          :control="control"
          :appliedOptions="appliedOptions"
          :styles="styles"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: onTooltip }">
              <v-btn
                fab
                text
                elevation="0"
                small
                :aria-label="translatedLabels.add"
                v-on="onTooltip"
                :class="styles.arrayList.addButton"
                :disabled="addDisabled"
                @click="addButtonClick"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            {{ translatedLabels.add }}
          </v-tooltip>
        </slot>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-container
        justify-space-around
        align-content-center
        :class="styles.arrayList.container"
      >
        <v-row justify="center">
          <v-expansion-panels
            accordion
            v-bind="expansionPanelsProps"
            v-model="currentlyExpanded"
          >
            <v-expansion-panel
              v-for="(_element, index) in control.data"
              :key="`${control.path}-${index}`"
              :class="styles.arrayList.item"
            >
              <v-expansion-panel-header :class="styles.arrayList.itemHeader">
                <v-container py-0 :class="styles.arrayList.itemContainer">
                  <v-row
                    :style="`display: grid; grid-template-columns: ${
                      !hideAvatar ? 'min-content' : ''
                    } auto min-content ${
                      appliedOptions.showSortButtons
                        ? 'min-content min-content'
                        : ''
                    }`"
                  >
                    <v-col v-if="!hideAvatar" align-self="center" class="pl-0">
                      <validation-badge
                        overlap
                        bordered
                        :errors="childErrors(index)"
                      >
                        <v-avatar size="40" aria-label="Index" color="primary">
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
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            :aria-label="translatedLabels.moveUp"
                            :disabled="index <= 0 || !control.enabled"
                            :class="styles.arrayList.itemMoveUp"
                            @click.native="moveUpClick($event, index)"
                          >
                            <v-icon class="notranslate">mdi-arrow-up</v-icon>
                          </v-btn>
                        </template>
                        {{ translatedLabels.moveUp }}
                      </v-tooltip>
                    </v-col>
                    <v-col
                      align-self="center"
                      v-if="appliedOptions.showSortButtons"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            :aria-label="translatedLabels.moveDown"
                            :disabled="
                              index >= control.data.length - 1 ||
                              !control.enabled
                            "
                            :class="styles.arrayList.itemMoveDown"
                            @click.native="moveDownClick($event, index)"
                          >
                            <v-icon class="notranslate">mdi-arrow-down</v-icon>
                          </v-btn>
                        </template>
                        {{ translatedLabels.moveDown }}
                      </v-tooltip>
                    </v-col>
                    <v-col align-self="center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            :aria-label="translatedLabels.delete"
                            :class="styles.arrayList.itemDelete"
                            :disabled="
                              !control.enabled ||
                              (appliedOptions.restrict &&
                                arraySchema !== undefined &&
                                arraySchema.minItems !== undefined &&
                                control.data.length <= arraySchema.minItems)
                            "
                            @click.stop.native="suggestToDelete = index"
                          >
                            <v-icon class="notranslate">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        {{ translatedLabels.delete }}
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-header>
              <v-expansion-panel-content :class="styles.arrayList.itemContent">
                <dispatch-renderer
                  :schema="control.schema"
                  :uischema="foundUISchema"
                  :path="composePaths(control.path, `${index}`)"
                  :enabled="control.enabled"
                  :renderers="control.renderers"
                  :cells="control.cells"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
      <v-container v-if="noData" :class="styles.arrayList.noData">
        No data
      </v-container>
    </v-card-text>
    <v-card-actions v-if="$scopedSlots.actions" class="pb-8">
      <slot
        name="actions"
        :labels="translatedLabels"
        :addClass="styles.arrayList.addButton"
        :addDisabled="addDisabled"
        :addClick="addButtonClick"
        :control="control"
        :appliedOptions="appliedOptions"
        :styles="styles"
      >
      </slot>
    </v-card-actions>
    <v-dialog
      :value="suggestToDelete !== null"
      max-width="600"
      @keydown.esc="suggestToDelete = null"
      @click:outside="suggestToDelete = null"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ translatedLabels.dialogTitle }}
        </v-card-title>

        <v-card-text> {{ translatedLabels.dialogText }} </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="suggestToDelete = null">
            {{ translatedLabels.dialogCancel }}</v-btn
          >
          <v-btn
            text
            ref="confirm"
            @click="
              removeItemsClick(
                suggestToDelete === null ? null : [suggestToDelete]
              );
              suggestToDelete = null;
            "
          >
            {{ translatedLabels.dialogConfirm }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  ControlElement,
  rankWith,
  isObjectArrayWithNesting,
  composePaths,
  createDefaultValue,
  UISchemaElement,
  findUISchema,
  Resolve,
  JsonSchema,
  getControlPath,
  getI18nKey,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  RendererProps,
} from '@jsonforms/vue2';
import {
  useNested,
  useVuetifyArrayControl,
  useTranslator,
  i18nDefaultMessages,
} from '../util';
import {
  VCard,
  VCardActions,
  VCardTitle,
  VCardText,
  VDialog,
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
} from 'vuetify/lib';
import { ValidationIcon, ValidationBadge } from '../controls/components/index';
import { ErrorObject } from 'ajv';
import { computed, ref } from 'vue';
import merge from 'lodash/merge';

type I18nArrayLayoutKey = keyof typeof i18nDefaultMessages.arraylayout;

const controlRenderer = defineComponent({
  name: 'array-layout-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardActions,
    VCardTitle,
    VCardText,
    VAvatar,
    VDialog,
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
    VExpansionPanelHeader,
    VExpansionPanelContent,
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
      control.appliedOptions.value.initCollapsed ? null : 0
    );
    const expansionPanelsProps = computed(() =>
      merge(
        { flat: false, focusable: true },
        control.vuetifyProps('v-expansion-panels')
      )
    );
    const suggestToDelete = ref<null | number>(null);
    // indicate to our child renderers that we are increasing the "nested" level
    useNested('array');
    const t = useTranslator();
    return {
      ...control,
      currentlyExpanded,
      expansionPanelsProps,
      suggestToDelete,
      t,
    };
  },
  computed: {
    addDisabled(): boolean {
      return (
        !this.control.enabled ||
        (this.appliedOptions.restrict &&
          this.arraySchema !== undefined &&
          this.arraySchema.maxItems !== undefined &&
          this.control.data.length >= this.arraySchema.maxItems)
      );
    },
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
        this.control.uischema,
        this.control.rootSchema
      );
    },
    arraySchema(): JsonSchema | undefined {
      return Resolve.schema(
        this.control.rootSchema,
        this.control.uischema.scope,
        this.control.rootSchema
      );
    },
    hideAvatar(): boolean {
      return !!this.appliedOptions.hideAvatar;
    },
    translatedLabels(): { [key in I18nArrayLayoutKey]: string } {
      const elementToDeleteText = this.childLabelForIndex(this.suggestToDelete);
      return {
        add: this.translateLabel('add'),
        delete: this.translateLabel('delete'),
        moveUp: this.translateLabel('moveUp'),
        moveDown: this.translateLabel('moveDown'),
        dialogTitle: this.translateLabel(
          'dialogTitle',
          {
            element: elementToDeleteText,
          },
          (message) =>
            message.replace(
              /\{\{\s?element\s?\}\}/,
              elementToDeleteText || 'element'
            )
        ),
        dialogText: this.translateLabel('dialogText'),
        dialogCancel: this.translateLabel('dialogCancel'),
        dialogConfirm: this.translateLabel('dialogConfirm'),
      };
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
      if (!this.appliedOptions.collapseNewItems && this.control.data?.length) {
        this.currentlyExpanded = this.control.data.length - 1;
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
          this.composePaths(this.control.path, `${index}`)
        );
      });
    },
    translateLabel(
      labelType: I18nArrayLayoutKey,
      additionalContext: Record<string, unknown> | undefined = undefined,
      transformMessage: (message: string) => string = (text) => text
    ): string {
      const i18nKey = getI18nKey(
        this.arraySchema,
        this.control.uischema,
        this.control.path,
        labelType
      );
      const context = {
        schema: this.control.schema,
        uischema: this.control.uischema,
        path: this.control.path,
        data: this.data,
        ...additionalContext,
      };
      const translation = this.t(i18nKey, undefined, context);
      if (translation !== undefined) {
        return translation;
      }
      return this.t(
        `arraylayout.${labelType}`,
        transformMessage(i18nDefaultMessages.arraylayout[labelType]),
        context
      );
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, isObjectArrayWithNesting),
};
</script>

<style scoped>
.notranslate {
  transform: none !important;
}
/deep/ .v-toolbar__content {
  padding-left: 0;
}
</style>
