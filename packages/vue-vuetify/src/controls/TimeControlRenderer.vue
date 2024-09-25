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
      :placeholder="appliedOptions.placeholder ?? timeFormat"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      v-bind="vuetifyProps('v-text-field')"
      v-model="inputModel"
      :clearable="control.enabled"
      @click:clear="clear"
      @focus="handleFocus"
      @blur="handleBlur"
      v-maska:[options]
    >
      <template v-slot:prepend-inner>
        <v-menu
          v-model="showMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          :min-width="ampm && useSeconds ? '340px' : '290px'"
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
              <v-time-picker
                v-if="showMenu"
                :model-value="showActions ? proxyModel.value : pickerValue"
                @update:model-value="
                  (val: string) => {
                    if (showActions) {
                      proxyModel.value = val;
                    } else {
                      pickerValue = val;
                      showMenu = false;
                    }
                  }
                "
                v-bind="vuetifyProps('v-time-picker')"
                :title="computedLabel"
                :min="minTime"
                :max="maxTime"
                :use-seconds="useSeconds"
                :format="ampm ? 'ampm' : '24hr'"
                :ampm-in-title="ampm ? true : false"
              >
                <template v-slot:actions v-if="showActions">
                  <component :is="actions"></component>
                </template>
              </v-time-picker>
            </template>
          </v-confirm-edit>
        </v-menu>
      </template>
    </v-text-field>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement, type JsonSchema } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { vMaska, type MaskOptions, type MaskaDetail } from 'maska';
import { computed, defineComponent, ref, unref } from 'vue';
import {
  VBtn,
  VConfirmEdit,
  VHover,
  VIcon,
  VMenu,
  VSpacer,
  VTextField,
} from 'vuetify/components';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

import { useLocale } from 'vuetify';
import {
  convertDayjsToMaskaFormat,
  expandLocaleFormat,
  parseDateTime,
  useIcons,
  useTranslator,
  useVuetifyControl,
} from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const JSON_SCHEMA_TIME_FORMATS = [
  'HH:mm:ss.SSSZ',
  'HH:mm:ss.SSS',
  'HH:mm:ssZ',
  'HH:mm:ss',
];

// https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum
type AjvMinMaxFormat = {
  formatMinimum?: string | { $data: any };
  formatExclusiveMinimum?: string | { $data: any };
  formatMaximum?: string | { $data: any };
  formatExclusiveMaximum?: string | { $data: any };
};

const controlRenderer = defineComponent({
  name: 'time-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextField,
    VMenu,
    VTimePicker,
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
    const t = useTranslator();

    const showMenu = ref(false);

    const adaptValue = (value: any) => value || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    const icons = useIcons();

    const ampm = computed(() => control.appliedOptions.value.ampm === true);

    const timeFormat = computed(
      () =>
        typeof control.appliedOptions.value.timeFormat == 'string'
          ? (expandLocaleFormat(control.appliedOptions.value.timeFormat) ??
            control.appliedOptions.value.timeFormat)
          : (expandLocaleFormat('LT') ?? 'H:mm'), // by default try to use localized default if unavailable then H:mm,
    );

    const useMask = control.appliedOptions.value.mask !== false;
    const maskCompleted = ref(false);

    const state = computed(() => convertDayjsToMaskaFormat(timeFormat.value));
    const locale = useLocale();

    const options = useMask
      ? computed<MaskOptions>(() => ({
          mask: state.value.mask,
          tokens: state.value.tokens,
          tokensReplace: true,
          onMaska: (detail: MaskaDetail) =>
            (maskCompleted.value = detail.completed),

          //invoke the locale.current as side effect so that the computed will rerun if the locale changes since the mask could be dependent on the locale
          _locale: unref(locale.current),
        }))
      : null;

    return {
      ...control,
      showMenu,
      t,
      adaptValue,
      icons,
      ampm,
      timeFormat,
      options,
      useMask,
      maskCompleted,
    };
  },
  computed: {
    pickerIcon(): string {
      return typeof this.appliedOptions.pickerIcon == 'string'
        ? this.appliedOptions.pickerIcon
        : this.icons.current.value.clock;
    },
    timeSaveFormat(): string {
      return typeof this.appliedOptions.timeSaveFormat == 'string'
        ? this.appliedOptions.timeSaveFormat
        : 'HH:mm:ssZ';
    },
    formats(): string[] {
      return [
        this.timeSaveFormat,
        this.timeFormat,
        ...JSON_SCHEMA_TIME_FORMATS,
      ];
    },
    useSeconds(): boolean {
      return this.timeFormat.includes('s') ? true : false;
    },
    minTime(): string | undefined {
      if (typeof this.vuetifyProps('v-time-picker').min === 'string') {
        // prefer the vuetify option first
        return this.vuetifyProps('v-time-picker').min;
      }

      // provide min so that the browser can display the native component with only selections that are allowed.
      // Since the browser supports only min there is posibility for the user to select a date that is defined in the formatExclusiveMinimum but the ajv will catch that validation.
      const schema = this.control.schema as JsonSchema & AjvMinMaxFormat;
      if (typeof schema.formatMinimum === 'string') {
        // convert to what VTimePicker expects
        const time = parseDateTime(schema.formatMinimum, this.formats);
        return time
          ? this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm')
          : schema.formatMinimum;
      } else if (typeof schema.formatExclusiveMinimum === 'string') {
        // convert to what VTimePicker expects
        let time = parseDateTime(schema.formatExclusiveMinimum, this.formats);
        if (time) {
          time = this.useSeconds
            ? time.add(1, 'second')
            : time.add(1, 'minute');
        }
        return time
          ? this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm')
          : schema.formatExclusiveMinimum;
      }
      return undefined;
    },
    maxTime(): string | undefined {
      if (typeof this.vuetifyProps('v-time-picker').max === 'string') {
        // prefer the vuetify option first
        return this.vuetifyProps('v-time-picker').max;
      }

      // provide max so that the browser can display the native component with only selections that are allowed.
      // Since the browser supports only max there is posibility for the user to select a date that is defined in the formatExclusiveMaximum but the ajv will catch that validation.
      const schema = this.control.schema as JsonSchema & AjvMinMaxFormat;
      if (typeof schema.formatMaximum === 'string') {
        // convert to what VTimePicker expects
        const time = parseDateTime(schema.formatMaximum, this.formats);
        return time
          ? this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm')
          : schema.formatMaximum;
      } else if (typeof schema.formatExclusiveMaximum === 'string') {
        // convert to what VTimePicker expects
        let time = parseDateTime(schema.formatExclusiveMaximum, this.formats);
        if (time) {
          time = this.useSeconds
            ? time.subtract(1, 'second')
            : time.subtract(1, 'minute');
        }
        return time
          ? this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm')
          : schema.formatExclusiveMaximum;
      }
      return undefined;
    },
    inputModel: {
      get(): string | undefined {
        const value = this.control.data;
        const time = parseDateTime(value, this.formats);
        return time ? time.format(this.timeFormat) : value;
      },
      set(val: string | undefined): void {
        let value = val;

        if (
          this.useMask &&
          !this.maskCompleted &&
          value !== null &&
          value !== undefined
        ) {
          // the value is set not not yet completed so do not set that until the full mask is completed
          // otherwise if the control.data is bound to another renderer with different dateTimeFormat then those will collide
          return;
        }

        const time = parseDateTime(value, this.timeFormat);

        if (time) {
          value = time.format(this.timeSaveFormat);
        }

        if (this.adaptValue(value) !== this.control.data) {
          this.onChange(value);
        }
      },
    },
    pickerValue: {
      get(): string | undefined {
        const value = this.control.data;

        const time = parseDateTime(value, this.formats);
        // show only valid values
        return time
          ? this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm')
          : undefined;
      },
      set(val: string) {
        this.onPickerChange(val);
      },
    },
    clearLabel(): string {
      const label =
        typeof this.appliedOptions.clearLabel == 'string'
          ? this.appliedOptions.clearLabel
          : 'Clear';

      return this.t(label, label);
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
    onPickerChange(value: string): void {
      const time = parseDateTime(value, this.useSeconds ? 'HH:mm:ss' : 'HH:mm');
      this.onChange(time ? time.format(this.timeSaveFormat) : value);
    },
    clear(): void {
      this.inputModel = undefined;
    },
  },
});

export default controlRenderer;
</script>
