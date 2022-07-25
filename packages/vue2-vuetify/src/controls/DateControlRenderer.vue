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
            v-model="showMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on: onMenu }">
              <v-icon v-on="onMenu" tabindex="-1">{{ pickerIcon }}</v-icon>
            </template>
            <v-date-picker
              v-if="showMenu"
              :value="pickerValue"
              ref="picker"
              v-bind="vuetifyProps('v-date-picker')"
              :min="minDate"
              :max="maxDate"
              :type="pickerType"
            >
              <v-btn text @click="clear"> {{ clearLabel }} </v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="showMenu = false">
                {{ cancelLabel }}
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="
                  () => {
                    onPickerChange($refs.picker.inputDate);
                    showMenu = false;
                  }
                "
              >
                {{ okLabel }}
              </v-btn>
            </v-date-picker>
          </v-menu>
        </template>
      </v-text-field>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isDateControl,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  rankWith,
} from '@jsonforms/core';
import { VueMaskDirective as Mask } from 'v-mask';
import { defineComponent } from '../vue';

import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';
import { ref } from '@vue/composition-api';
import dayjs from 'dayjs';
import {
  VBtn,
  VDatePicker,
  VHover,
  VIcon,
  VMenu,
  VSpacer,
  VTextField,
} from 'vuetify/lib';
import { parseDateTime, useTranslator, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const JSON_SCHEMA_DATE_FORMATS = ['YYYY-MM-DD'];

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
    VHover,
    VTextField,
    VMenu,
    VDatePicker,
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
        : 'mdi-calendar';
    },
    dateFormat(): string {
      return typeof this.appliedOptions.dateFormat == 'string'
        ? this.appliedOptions.dateFormat
        : 'YYYY-MM-DD';
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
    pickerType(): string {
      if (!this.dateFormat.includes('D')) {
        return 'month';
      }
      return 'date';
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
    inputValue(): string | undefined {
      const value = this.control.data;
      const date = parseDateTime(value, this.formats);
      return date ? date.format(this.dateFormat) : value;
    },
    pickerValue(): string | undefined {
      const value = this.control.data;

      const date = parseDateTime(value, this.formats);
      // show only valid values
      return date ? date.format('YYYY-MM-DD') : undefined;
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
      const date = parseDateTime(value, this.dateFormat);
      const newdata = date ? date.format(this.dateSaveFormat) : value;
      if (this.adaptValue(newdata) !== this.control.data) {
        // only invoke onChange when values are different since v-mask is also listening on input which lead to loop
        this.onChange(date ? date.format(this.dateSaveFormat) : value);
      }
    },
    onPickerChange(value: string): void {
      const date = parseDateTime(value, 'YYYY-MM-DD');
      this.onChange(date ? date.format(this.dateSaveFormat) : value);
    },
    clear(): void {
      this.mask = undefined;
      this.onChange(null);
    },
    maskFunction(value: string): (string | RegExp)[] {
      const format = this.dateFormat;

      const parts = format.split(/([^YMD]*)(YYYY|YY|MMMM|MMM|MM|M|DD|D)/);

      let index = 0;

      let result: (string | RegExp)[] = [];
      for (const part of parts) {
        if (!part || part === '') {
          continue;
        }
        if (index > value.length) {
          break;
        }
        if (part == 'YYYY') {
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          index += 4;
        } else if (part == 'YY') {
          result.push(/[0-9]/);
          result.push(/[0-9]/);
          index += 2;
        } else if (part == 'M') {
          result.push(/[1]/);
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
        } else if (part == 'MM') {
          result.push(/[0-1]/);
          result.push(value.charAt(index) === '0' ? /[1-9]/ : /[0-2]/);
          index += 2;
        } else if (part == 'MMM') {
          let increment = 0;
          for (let position = 0; position <= 2; position++) {
            let regex: string | undefined = undefined;
            for (let i = 0; i <= 11; i++) {
              const month = dayjs().month(i).format('MMM');
              if (
                value.charAt(index + position) === month.charAt(position) ||
                value.charAt(index + position) === ''
              ) {
                if (regex === undefined) {
                  regex = '(';
                } else {
                  regex += '|';
                }
                regex += month.charAt(position);
              }
            }
            if (regex) {
              regex += ')';
              result.push(new RegExp(regex));
              increment++;
            } else {
              break;
            }
          }
          index += increment;
        } else if (part == 'MMMM') {
          let increment = 0;
          let maxLength = 0;
          let months: string[] = [];

          for (let i = 0; i <= 11; i++) {
            const month = dayjs().month(i).format('MMMM');
            months.push(month);
            if (month.length > maxLength) {
              maxLength = month.length;
            }
          }

          for (let position = 0; position < maxLength; position++) {
            let regex: string | undefined = undefined;
            for (let i = 0; i <= 11; i++) {
              const month = months[i];
              if (
                value.charAt(index + position) == month.charAt(position) ||
                value.charAt(index + position) === ''
              ) {
                if (regex === undefined) {
                  regex = '(';
                } else {
                  regex += '|';
                }
                regex += month.charAt(position);
              }
            }
            if (regex) {
              regex += ')';
              result.push(new RegExp(regex));
              increment++;
            } else {
              break;
            }
          }
          index += increment;
        } else if (part == 'D') {
          result.push(/[1-3]/);
          if (
            value.charAt(index) === '1' ||
            value.charAt(index) === '2' ||
            value.charAt(index) === '3'
          ) {
            if (value.charAt(index) === '3') {
              if (
                value.charAt(index + 1) === '0' ||
                value.charAt(index + 1) === '1'
              ) {
                result.push(/[0-1]/);
                index += 1;
              } else if (value.charAt(index + 1) === '') {
                result.push(/[0-1]?/);
              }
            } else {
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
          }
          index += 1;
        } else if (part == 'DD') {
          result.push(/[0-3]/);
          result.push(
            value.charAt(index) === '3'
              ? /[0-1]/
              : value.charAt(index) === '0'
              ? /[1-9]/
              : /[0-9]/
          );
          index += 2;
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
  tester: rankWith(2, isDateControl),
};
</script>
