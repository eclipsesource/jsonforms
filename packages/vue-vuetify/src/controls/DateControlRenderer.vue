<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      v-disabled-icon-focus
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder ?? dateFormat"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      v-bind="vuetifyProps('v-text-field')"
      v-model="inputModel"
      :clearable="control.enabled"
      @focus="handleFocus"
      @blur="handleBlur"
      v-maska:[options]="maska"
    >
      <template v-slot:prepend-inner>
        <v-menu
          v-model="showMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          min-width="290px"
          v-bind="vuetifyProps('v-menu')"
          activator="parent"
          :disabled="!control.enabled"
        >
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" tabindex="-1">{{ pickerIcon }}</v-icon>
          </template>
          <v-confirm-edit
            v-model="pickerValue"
            :ok-text="okLabel"
            :cancel-text="cancelLabel"
            @cancel="() => (showMenu = false)"
            @save="() => (showMenu = false)"
          >
            <template v-slot:default="{ model: proxyModel, actions }">
              <v-date-picker
                v-if="showMenu"
                :model-value="showActions ? proxyModel.value : pickerValue"
                @update:model-value="
                  (val) => updateDatePickerValue(val, proxyModel)
                "
                v-bind="vuetifyProps('v-date-picker')"
                :title="computedLabel"
                :min="minDate"
                :max="maxDate"
                v-model:view-mode="viewMode"
                @update:month="
                  (month) => updateDatePickerMonth(month, proxyModel)
                "
                @update:year="(year) => updateDatePickerYear(year, proxyModel)"
              >
                <template v-slot:actions v-if="showActions">
                  <component :is="actions"></component>
                </template>
              </v-date-picker>
            </template>
          </v-confirm-edit>
        </v-menu>
      </template>
    </v-text-field>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement, type JsonSchema } from '@jsonforms/core';
import type { Ref } from 'vue';
import { computed, defineComponent, reactive, ref, unref, watch } from 'vue';

import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { vMaska, type MaskOptions } from 'maska';
import { useLocale } from 'vuetify';
import {
  VBtn,
  VConfirmEdit,
  VDatePicker,
  VIcon,
  VMenu,
  VSpacer,
  VTextField,
} from 'vuetify/components';
import {
  convertDayjsToMaskaFormat,
  determineClearValue,
  expandLocaleFormat,
  parseDateTime,
  useTranslator,
  useVuetifyControl,
} from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const JSON_SCHEMA_DATE_FORMATS = ['YYYY-MM-DD'];

type ViewModeType = 'year' | 'months' | 'month';

// https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum
type AjvMinMaxFormat = {
  formatMinimum?: string | { $data: any };
  formatExclusiveMinimum?: string | { $data: any };
  formatMaximum?: string | { $data: any };
  formatExclusiveMaximum?: string | { $data: any };
};

const controlRenderer = defineComponent({
  name: 'date-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
    VMenu,
    VDatePicker,
    VIcon,
    VSpacer,
    VBtn,
    VConfirmEdit,
  },
  directives: { DisabledIconFocus, maska: vMaska },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(props, '');
    const t = useTranslator();

    const showMenu = ref(false);

    const adaptValue = (value: any) => (value === null ? clearValue : value);
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    const dateFormat = computed<string>(
      () =>
        typeof control.appliedOptions.value.dateFormat == 'string'
          ? (expandLocaleFormat(control.appliedOptions.value.dateFormat) ??
            control.appliedOptions.value.dateFormat)
          : (expandLocaleFormat('L') ?? 'YYYY-MM-DD'), // by default try to use localized default if unavailable then YYYY-MM-DD
    );

    const useMask = control.appliedOptions.value.mask !== false;
    const locale = useLocale();

    const maska = reactive({
      masked: '',
      unmasked: '',
      completed: false,
    });
    const options = useMask
      ? computed<MaskOptions>(() => ({
          mask: state.value.mask,
          tokens: state.value.tokens,
          tokensReplace: true,

          //invoke the locale.current as side effect so that the computed will rerun if the locale changes since the mask could be dependent on the locale
          _locale: unref(locale.current),
        }))
      : null;

    const state = computed(() => convertDayjsToMaskaFormat(dateFormat.value));

    const viewMode = ref<ViewModeType>('month');

    const views = computed<('day' | 'month' | 'year')[] | undefined>(() =>
      Array.isArray(control.appliedOptions.value.views)
        ? control.appliedOptions.value.views.filter(
            (view: string) =>
              view === 'day' || view === 'month' || view === 'year',
          )
        : undefined,
    );

    if (views.value !== undefined) {
      const allowedViewModes = computed<ViewModeType[]>(() => {
        // Define the priority order
        const viewPriorityOrder: Record<ViewModeType, number> = {
          month: 1,
          months: 2,
          year: 3,
        };

        if (views.value === undefined) {
          return [];
        }
        return views.value
          .map((view) => {
            if (view === 'day') {
              return 'month';
            }
            if (view === 'month') {
              return 'months';
            }
            if (view === 'year') {
              return 'year';
            }

            return null; // null value will be filtered out
          })
          .filter((value): value is ViewModeType => value !== null)
          .sort((a, b) => viewPriorityOrder[a] - viewPriorityOrder[b]);
      });

      if (allowedViewModes.value.length > 0) {
        viewMode.value = allowedViewModes.value[0];
      }

      watch(viewMode, (newViewMode) => {
        if (
          allowedViewModes.value.length > 0 &&
          !allowedViewModes.value.includes(newViewMode)
        ) {
          switch (newViewMode) {
            case 'month':
              viewMode.value = allowedViewModes.value.includes('months')
                ? 'months'
                : 'year';
              break;
            case 'months':
              viewMode.value = allowedViewModes.value.includes('year')
                ? 'year'
                : 'month';
              break;
            case 'year':
              viewMode.value = allowedViewModes.value.includes('months')
                ? 'months'
                : 'month';
              break;
            default:
              break;
          }
        }
      });
    }

    return {
      ...control,
      views,
      viewMode,
      maska,
      showMenu,
      t,
      adaptValue,
      dateFormat,
      options,
      useMask,
    };
  },
  computed: {
    pickerIcon(): string {
      if (typeof this.appliedOptions.pickerIcon === 'string') {
        return this.appliedOptions.pickerIcon;
      }

      // vuetify defined icon alias
      return '$calendar';
    },
    dateSaveFormat(): string {
      return typeof this.appliedOptions.dateSaveFormat == 'string'
        ? this.appliedOptions.dateSaveFormat
        : 'YYYY-MM-DD';
    },
    formats(): string[] {
      return [
        this.dateSaveFormat,
        this.dateFormat,
        ...JSON_SCHEMA_DATE_FORMATS,
      ];
    },
    minDate(): string | undefined {
      if (typeof this.vuetifyProps('v-date-picker').min === 'string') {
        // prefer the vuetify option first
        return this.vuetifyProps('v-date-picker').min;
      }
      // provide min so that the browser can display the native component with only selections that are allowed.
      // Since the browser supports only min there is posibility for the user to select a date that is defined in the formatExclusiveMinimum but the ajv will catch that validation.
      const schema = this.control.schema as JsonSchema & AjvMinMaxFormat;
      if (typeof schema.formatMinimum === 'string') {
        return schema.formatMinimum;
      } else if (typeof schema.formatExclusiveMinimum === 'string') {
        let date = parseDateTime(schema.formatExclusiveMinimum, this.formats);
        if (date) {
          // the format is exclusive
          date = date.add(1, 'day');
        }
        return date ? date.format('YYYY-MM-DD') : schema.formatExclusiveMinimum;
      }
      return undefined;
    },
    maxDate(): string | undefined {
      if (typeof this.vuetifyProps('v-date-picker').max === 'string') {
        // prefer the vuetify option first
        return this.vuetifyProps('v-date-picker').max;
      }
      // provide max so that the browser can display the native component with only selections that are allowed.
      // Since the browser supports only max there is posibility for the user to select a date that is defined in the formatExclusiveMaximum but the ajv will catch that validation.
      const schema = this.control.schema as JsonSchema & AjvMinMaxFormat;
      if (typeof schema.formatMaximum === 'string') {
        return schema.formatMaximum;
      } else if (typeof schema.formatExclusiveMaximum === 'string') {
        let date = parseDateTime(schema.formatExclusiveMaximum, this.formats);
        if (date) {
          // the format is exclusive
          date = date.subtract(1, 'day');
        }
        return date ? date.format('YYYY-MM-DD') : schema.formatExclusiveMaximum;
      }
      return undefined;
    },
    inputModel: {
      get(): string | null {
        const value = this.control.data;
        const date = parseDateTime(value, this.formats);
        return date ? date.format(this.dateFormat) : value;
      },
      set(val: string | null): void {
        let value = val;

        if (this.useMask && !this.maska.completed && value) {
          // the value is set not not yet completed so do not set that until the full mask is completed
          // otherwise if the control.data is bound to another renderer with different dateTimeFormat then those will collide
          return;
        }

        if (value == null) {
          // clear
          this.maska.masked = '';
          this.maska.unmasked = '';
          this.maska.completed = false;
        }

        if (this.useMask && value === '' && this.maska.unmasked === '') {
          // once cleared the maska will set the value to ''
          return;
        }

        const date = parseDateTime(value, this.dateFormat);

        if (date) {
          value = date.format(this.dateSaveFormat);
        }

        if (this.adaptValue(value) !== this.control.data) {
          this.onChange(value);
        }
      },
    },
    pickerValue: {
      get(): Date | undefined {
        const value = this.control.data;
        const date = parseDateTime(value, this.formats);
        // show only valid values
        return date ? date.toDate() : undefined;
      },
      set(val: Date): void {
        this.onPickerChange(val);
      },
    },
    cancelLabel(): string {
      const label =
        typeof this.appliedOptions.cancelLabel == 'string'
          ? this.appliedOptions.cancelLabel
          : 'Cancel';

      return this.t(label, label);
    },
    okLabel(): string {
      const label =
        typeof this.appliedOptions.okLabel == 'string'
          ? this.appliedOptions.okLabel
          : 'OK';
      return this.t(label, label);
    },
    showActions(): boolean {
      return this.appliedOptions.showActions === true;
    },
  },
  methods: {
    onPickerChange(value: Date): void {
      const date = parseDateTime(value, undefined);
      let newdata: string | null = date
        ? date.format(this.dateSaveFormat)
        : null;

      this.onChange(newdata);
    },
    updateDatePickerValue(
      val: unknown,
      proxyModel: Ref<Date | undefined>,
    ): void {
      if (this.showActions) {
        proxyModel.value = val as Date;
      } else {
        this.pickerValue = val as Date;
        this.showMenu = false;
      }
    },
    updateDatePickerYear(
      year: number,
      proxyModel: Ref<Date | undefined>,
    ): void {
      if (this.showActions) {
        const date = proxyModel.value ?? new Date();
        date.setFullYear(year);
        proxyModel.value = date;
      } else {
        const date = this.pickerValue ?? new Date();
        date.setFullYear(year);
        this.pickerValue = date;

        if (
          this.views &&
          this.views.length === 1 &&
          this.views.includes('year')
        ) {
          // close the menu since only year can be selected
          this.showMenu = false;
        }
      }
    },
    updateDatePickerMonth(
      month: number,
      proxyModel: Ref<Date | undefined>,
    ): void {
      if (this.showActions) {
        const date = proxyModel.value ?? new Date();
        date.setMonth(month);
        proxyModel.value = date;
      } else {
        const date = this.pickerValue ?? new Date();
        date.setMonth(month);
        this.pickerValue = date;

        if (this.views && !this.views.includes('day')) {
          // close the menu since day can't be selected
          this.showMenu = false;
        }
      }
    },
  },
});

export default controlRenderer;
</script>
