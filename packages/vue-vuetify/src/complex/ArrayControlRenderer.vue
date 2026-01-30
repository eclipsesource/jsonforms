<template>
  <v-card
    v-if="control.visible"
    :class="styles.arrayList.root"
    elevation="0"
    v-bind="vuetifyProps('v-card')"
  >
    <v-card-title
      :class="styles.arrayList.title"
      v-bind="vuetifyProps('v-card-title')"
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
        <validation-icon
          v-if="control.childErrors.length > 0"
          :errors="control.childErrors"
        />
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              elevation="0"
              small
              :aria-label="control.translations.addAriaLabel"
              v-bind="props"
              :class="styles.arrayList.addButton"
              :disabled="
                !control.enabled ||
                (appliedOptions.restrict &&
                  control.arraySchema !== undefined &&
                  control.arraySchema.maxItems !== undefined &&
                  dataLength >= control.arraySchema.maxItems)
              "
              @click="addButtonClick"
            >
              <v-icon>{{ icons.current.value.itemAdd }}</v-icon>
            </v-btn>
          </template>
          {{ control.translations.addTooltip }}
        </v-tooltip>
      </v-toolbar>
    </v-card-title>
    <v-card-text v-bind="vuetifyProps('v-card-text')">
      <v-container justify-space-around align-content-center>
        <v-row justify="center">
          <v-table
            class="array-container flex"
            v-bind="vuetifyProps('v-table')"
          >
            <thead v-if="control.schema.type === 'object'">
              <tr>
                <th
                  v-for="(prop, index) in validColumnProps"
                  :key="`${control.path}-header-${validColumnProps.length}-${index}`"
                  scope="col"
                >
                  {{ title(prop) }}
                </th>
                <th
                  v-if="control.enabled"
                  :class="
                    appliedOptions.showSortButtons
                      ? 'fixed-cell'
                      : 'fixed-cell-small'
                  "
                  scope="col"
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(element, index) in control.data"
                :key="`${control.path}-${control.data.length}-${index}`"
                :class="styles.arrayList.item"
              >
                <td
                  v-for="propName in validColumnProps"
                  :key="
                    composePaths(
                      composePaths(
                        control.path,
                        `${validColumnProps.length}-${index}`,
                      ),
                      propName,
                    )
                  "
                >
                  <dispatch-renderer
                    :schema="control.schema"
                    :uischema="resolveUiSchema(propName)"
                    :path="composePaths(control.path, `${index}`)"
                    :enabled="control.enabled"
                    :renderers="control.renderers"
                    :cells="control.cells"
                  />
                </td>
                <td
                  v-if="control.enabled"
                  :class="
                    appliedOptions.showSortButtons
                      ? 'fixed-cell'
                      : 'fixed-cell-small'
                  "
                >
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        v-if="appliedOptions.showSortButtons"
                        icon
                        variant="text"
                        elevation="0"
                        small
                        :aria-label="control.translations.upAriaLabel"
                        :disabled="index <= 0 || !control.enabled"
                        :class="styles.arrayList.itemMoveUp"
                        @click="moveUpClick($event, index)"
                      >
                        <v-icon class="notranslate">{{
                          icons.current.value.itemMoveUp
                        }}</v-icon>
                      </v-btn>
                    </template>
                    {{ control.translations.up }}
                  </v-tooltip>
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        v-if="appliedOptions.showSortButtons"
                        icon
                        variant="text"
                        elevation="0"
                        small
                        :aria-label="control.translations.downAriaLabel"
                        :disabled="index >= dataLength - 1 || !control.enabled"
                        :class="styles.arrayList.itemMoveDown"
                        @click="moveDownClick($event, index)"
                      >
                        <v-icon class="notranslate">{{
                          icons.current.value.itemMoveDown
                        }}</v-icon>
                      </v-btn>
                    </template>
                    {{ control.translations.down }}
                  </v-tooltip>
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        variant="text"
                        elevation="0"
                        small
                        :aria-label="control.translations.removeAriaLabel"
                        :class="styles.arrayList.itemDelete"
                        :disabled="
                          !control.enabled ||
                          (appliedOptions.restrict &&
                            control.arraySchema !== undefined &&
                            control.arraySchema.minItems !== undefined &&
                            dataLength <= control.arraySchema.minItems)
                        "
                        @click="removeItemsClick($event, [index])"
                      >
                        <v-icon class="notranslate">{{
                          icons.current.value.itemDelete
                        }}</v-icon>
                      </v-btn>
                    </template>
                    {{ control.translations.removeTooltip }}
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
      </v-container>
      <v-container v-if="dataLength === 0" :class="styles.arrayList.noData">
        {{ control.translations.noDataMessage }}
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  composePaths,
  createDefaultValue,
  type ControlElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  type RendererProps,
} from '@jsonforms/vue';
import startCase from 'lodash/startCase';
import { defineComponent } from 'vue';
import {
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VContainer,
  VIcon,
  VRow,
  VSpacer,
  VTable,
  VToolbar,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/components';
import { ValidationIcon } from '../controls/components/index';
import { useIcons, useVuetifyArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'array-control-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
    VRow,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VIcon,
    VBtn,
    VSpacer,
    VContainer,
    ValidationIcon,
    VTable,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const icons = useIcons();
    const input = useJsonFormsArrayControl(props);

    return {
      ...useVuetifyArrayControl(input),
      icons,
    };
  },
  computed: {
    dataLength(): number {
      return this.control.data ? this.control.data.length : 0;
    },
    validColumnProps() {
      if (
        this.control.schema.type === 'object' &&
        typeof this.control.schema.properties === 'object'
      ) {
        return Object.keys(this.control.schema.properties).filter(
          (prop) => this.control.schema.properties![prop].type !== 'array',
        );
      }
      // primitives
      return [''];
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema),
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
    title(prop: string) {
      return this.control.schema.properties?.[prop]?.title ?? startCase(prop);
    },
    resolveUiSchema(propName: string) {
      return this.control.schema.properties && propName
        ? this.controlWithoutLabel(`#/properties/${propName}`)
        : this.controlWithoutLabel('#');
    },
    controlWithoutLabel(scope: string): ControlElement {
      return { type: 'Control', scope: scope, label: false };
    },
  },
});

export default controlRenderer;
</script>

<style scoped>
.fixed-cell {
  width: 150px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: center;
}

.fixed-cell-small {
  width: 50px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: center;
}

.array-container {
  width: 100%;
}
.array-container tbody tr td {
  border-bottom: none !important;
}

.array-container tbody tr td .container {
  padding: 0;
  margin: 0;
}
</style>
