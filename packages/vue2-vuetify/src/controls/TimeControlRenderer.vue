<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-text-field
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="control.errors"
        v-bind="vuetifyProps('v-text-field')"
        v-mask="mask"
        v-on="onMenu"
        :value="inputValue"
        @input="onInputChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
        <template slot="append">
          <v-icon v-if="hover" tabindex="-1" @click="clear">$clear</v-icon>
        </template>
        <template slot="prepend-inner">
          <v-menu
            ref="menu"
            v-model="showMenu"
            :close-on-content-click="false"
            :return-value.sync="pickerValue"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on: onMenu }">
              <v-icon v-on="onMenu" tabindex="-1">{{ pickerIcon }}</v-icon>
            </template>
            <v-time-picker
              v-if="showMenu"
              v-model="pickerValue"
              ref="picker"
              v-bind="vuetifyProps('v-time-picker')"
              :min="minTime"
              :max="maxTime"
              :use-seconds="useSeconds"
              :format="ampm ? 'ampm' : '24hr'"
            >
              <v-btn text @click="clear"> {{ clearLabel }} </v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="showMenu = false">
                {{ cancelLabel }}
              </v-btn>
              <v-btn text color="primary" @click="okHandler">
                {{ okLabel }}
              </v-btn></v-time-picker
            >
          </v-menu>
        </template>
      </v-text-field>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isTimeControl,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  rankWith,
} from '@jsonforms/core';
import { defineComponent, ref } from 'vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';
import { VueMaskDirective as Mask } from 'v-mask';
import {
  VBtn,
  VHover,
  VIcon,
  VMenu,
  VSpacer,
  VTextField,
  VTimePicker,
} from 'vuetify/lib';
import { parseDateTime, useTranslator, useVuetifyControl } from '../util';
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
  },
  directives: { DisabledIconFocus, Mask },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const t = useTranslator();

    const showMenu = ref(false);
    const mask = ref<((value: string) => (string | RegExp)[]) | undefined>(
      undefined
    );

    const adaptValue = (value: any) => value || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);
    return { ...control, showMenu, mask, t, adaptValue };
  },
  watch: {
    isFocused(newFocus) {
      if (newFocus && this.applyMask) {
        this.mask = this.maskFunction.bind(this);
      } else {
        this.mask = undefined;
      }
    },
  },
  computed: {
    applyMask(): boolean {
      return typeof this.appliedOptions.mask == 'boolean'
        ? this.appliedOptions.mask
        : true;
    },
    pickerIcon(): string {
      return typeof this.appliedOptions.pickerIcon == 'string'
        ? this.appliedOptions.pickerIcon
        : 'mdi-clock-outline';
    },
    timeFormat(): string {
      return typeof this.appliedOptions.timeFormat == 'string'
        ? this.appliedOptions.timeFormat
        : this.ampm
        ? 'hh:mm a'
        : 'HH:mm';
    },
    timeSaveFormat(): string {
      return typeof this.appliedOptions.timeSaveFormat == 'string'
        ? this.appliedOptions.timeSaveFormat
        : 'HH:mm:ss';
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
    ampm(): boolean {
      return this.appliedOptions.ampm === true;
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
    inputValue(): string | undefined {
      const value = this.control.data;
      const time = parseDateTime(value, this.formats);
      return time ? time.format(this.timeFormat) : value;
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

      return label;
    },
    cancelLabel(): string {
      const label =
        typeof this.appliedOptions.cancelLabel == 'string'
          ? this.appliedOptions.cancelLabel
          : 'Cancel';

      return label;
    },
    okLabel(): string {
      const label =
        typeof this.appliedOptions.okLabel == 'string'
          ? this.appliedOptions.okLabel
          : 'OK';
      return label;
    },
  },
  methods: {
    onInputChange(value: string): void {
      const time = parseDateTime(value, this.timeFormat);
      const newdata = time ? time.format(this.timeSaveFormat) : value;
      if (this.adaptValue(newdata) !== this.control.data) {
        // only invoke onChange when values are different since v-mask is also listening on input which lead to loop
        this.onChange(newdata);
      }
    },
    onPickerChange(value: string): void {
      const time = parseDateTime(value, this.useSeconds ? 'HH:mm:ss' : 'HH:mm');
      this.onChange(time ? time.format(this.timeSaveFormat) : value);
    },
    okHandler(): void {
      (this.$refs.menu as any).save(this.pickerValue);
      this.showMenu = false;
    },
    clear(): void {
      this.mask = undefined;
      this.onChange(null);
    },
    maskFunction(value: string): (string | RegExp)[] {
      const format = this.timeFormat;
      const parts = format.split(/([^HhmsAaSZ]*)(hh?|HH?|mm?|ss?|a|A|SSS|Z)/);

      let index = 0;

      let result: (string | RegExp)[] = [];
      for (const part of parts) {
        if (!part || part === '') {
          continue;
        }
        if (index > value.length) {
          break;
        }

        if (part == 'H') {
          result.push(/[0-9]/);
          if (value.charAt(index) === '2') {
            if (
              value.charAt(index + 1) === '0' ||
              value.charAt(index + 1) === '1' ||
              value.charAt(index + 1) === '2' ||
              value.charAt(index + 1) === '3'
            ) {
              result.push(/[0-3]/);
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push(/[0-3]?/);
            }
          } else if (value.charAt(index) === '1') {
            if (
              value.charAt(index + 1) === '0' ||
              value.charAt(index + 1) === '1' ||
              value.charAt(index + 1) === '2' ||
              value.charAt(index + 1) === '3' ||
              value.charAt(index + 1) === '4' ||
              value.charAt(index + 1) === '5' ||
              value.charAt(index + 1) === '6' ||
              value.charAt(index + 1) === '7' ||
              value.charAt(index + 1) === '8' ||
              value.charAt(index + 1) === '9'
            ) {
              result.push(/[0-9]/);
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push(/[0-9]?/);
            }
          }
          index += 1;
        } else if (part == 'HH') {
          result.push(/[0-2]/);
          if (value.charAt(index) === '0' || value.charAt(index) === '1') {
            result.push(/[0-9]/);
          } else if (value.charAt(index) === '2') {
            result.push(/[0-3]/);
          }
          index += 2;
        } else if (part == 'h') {
          result.push(/[1-9]/);
          if (value.charAt(index) === '1') {
            if (
              value.charAt(index + 1) == '0' ||
              value.charAt(index + 1) == '1' ||
              value.charAt(index + 1) == '2'
            ) {
              result.push(/[0-2]/);
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push(/[0-2]?/);
            }
          }
          index += 1;
        } else if (part == 'hh') {
          result.push(/[0-1]/);
          result.push(value.charAt(index) === '0' ? /[1-9]/ : /[0-2]/);
          index += 2;
        } else if (part == 'm') {
          result.push(/[0-9]/);
          if (
            value.charAt(index) === '1' ||
            value.charAt(index) === '2' ||
            value.charAt(index) === '3' ||
            value.charAt(index) === '4' ||
            value.charAt(index) === '5'
          ) {
            if (
              value.charAt(index + 1) === '0' ||
              value.charAt(index + 1) === '1' ||
              value.charAt(index + 1) === '2' ||
              value.charAt(index + 1) === '3' ||
              value.charAt(index + 1) === '4' ||
              value.charAt(index + 1) === '5' ||
              value.charAt(index + 1) === '6' ||
              value.charAt(index + 1) === '7' ||
              value.charAt(index + 1) === '8' ||
              value.charAt(index + 1) === '9'
            ) {
              result.push(/[0-9]/);
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push(/[0-9]?/);
            }
          }
          index += 1;
        } else if (part == 'mm') {
          result.push(/[0-5]/);
          result.push(/[0-9]/);
          index += 2;
        } else if (part == 's') {
          result.push(/[0-9]/);
          if (
            value.charAt(index) === '1' ||
            value.charAt(index) === '2' ||
            value.charAt(index) === '3' ||
            value.charAt(index) === '4' ||
            value.charAt(index) === '5'
          ) {
            if (
              value.charAt(index + 1) === '0' ||
              value.charAt(index + 1) === '1' ||
              value.charAt(index + 1) === '2' ||
              value.charAt(index + 1) === '3' ||
              value.charAt(index + 1) === '4' ||
              value.charAt(index + 1) === '5' ||
              value.charAt(index + 1) === '6' ||
              value.charAt(index + 1) === '7' ||
              value.charAt(index + 1) === '8' ||
              value.charAt(index + 1) === '9'
            ) {
              result.push(/[0-9]/);
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push(/[0-9]?/);
            }
          }
          index += 1;
        } else if (part == 'ss') {
          result.push(/[0-5]/);
          result.push(/[0-9]/);
          index += 2;
        } else if (part == 'a') {
          result.push(/a|p/);
          result.push('m');
          index += 2;
        } else if (part == 'A') {
          result.push(/A|P/);
          result.push('M');
          index += 2;
        } else if (part == 'Z') {
          //GMT-12 to GMT+14
          result.push(/\+|-/);
          result.push(/[0-1]/);
          if (value.charAt(index + 1) === '0') {
            result.push(/[0-9]/);
          } else if (value.charAt(index + 1) === '1') {
            result.push(value.charAt(index) === '+' ? /[0-4]/ : /[0-2]/);
          }
          result.push(':');
          result.push(/[0-5]/);
          result.push(/[0-9]/);
          index += 6;
        } else if (part == 'SSS') {
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          index += 3;
        } else {
          result.push(part);
          index += part.length;
        }
      }

      return result;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isTimeControl),
};
</script>
