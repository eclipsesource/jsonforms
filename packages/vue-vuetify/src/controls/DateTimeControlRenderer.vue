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
        :model-value="inputValue"
        @update:model-value="onInputChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
        <template slot="append">
          <v-icon v-if="hover && control.enabled" tabindex="-1" @click="clear"
            >$clear</v-icon
          >
        </template>
        <template slot="prepend-inner">
          <v-menu
            ref="menu"
            v-model="showMenu"
            :close-on-content-click="false"
            :return-value.sync="pickerValue"
            transition="scale-transition"
            offset-y
            :min-width="useTabLayout ? '290px' : '580px'"
            v-bind="vuetifyProps('v-menu')"
            :disabled="!control.enabled"
          >
            <template v-slot:activator="{ on: onMenu }">
              <v-icon v-on="onMenu" tabindex="-1">{{ pickerIcon }}</v-icon>
            </template>
            <v-card v-if="showMenu">
              <v-window v-if="useTabLayout" v-model="activeTab">
                <v-tab key="date" href="#date" class="primary--text">
                  <v-icon>mdi-calendar</v-icon>
                </v-tab>
                <v-spacer></v-spacer>
                <v-tab key="time" href="#time" class="primary--text">
                  <v-icon>mdi-clock-outline</v-icon>
                </v-tab>

                <v-window-item value="date"
                  ><!--v-date-picker
                    v-if="showMenu"
                    v-model="datePickerValue"
                    ref="datePicker"
                    v-bind="vuetifyProps('v-date-picker')"
                    :min="minDate"
                    :max="maxDate"
                    @input="activeTab = 'time'"
                  >
                  </v-date-picker-->
                </v-window-item>
                <v-window-item value="time"
                  ><!--v-time-picker
                    v-model="timePickerValue"
                    ref="timePicker"
                    v-bind="vuetifyProps('v-time-picker')"
                    :min="minTime"
                    :max="maxTime"
                    :use-seconds="useSeconds"
                    :format="ampm ? 'ampm' : '24hr'"
                    @click:minute="onMinute"
                    @click:second="onSecond"
                  ></v-time-picker-->
                </v-window-item>
              </v-window>
              <v-row no-gutters v-else>
                <v-col min-width="290px" cols="auto">
                  <!--v-date-picker
                    v-if="showMenu"
                    v-model="datePickerValue"
                    ref="datePicker"
                    v-bind="vuetifyProps('v-date-picker')"
                    :min="minDate"
                    :max="maxDate"
                  >
                  </v-date-picker-->
                </v-col>
                <v-col min-width="290px" cols="auto">
                  <!--v-time-picker
                    v-model="timePickerValue"
                    ref="timePicker"
                    v-bind="vuetifyProps('v-time-picker')"
                    :min="minTime"
                    :max="maxTime"
                    :use-seconds="useSeconds"
                    :format="ampm ? 'ampm' : '24hr'"
                    @click:minute="onMinute"
                    @click:second="onSecond"
                  ></v-time-picker-->
                </v-col>
              </v-row>
              <v-card-actions v-if="showActions">
                <v-btn text @click="clear"> {{ clearLabel }} </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="showMenu = false">
                  {{ cancelLabel }}
                </v-btn>
                <v-btn text color="primary" @click="okHandler">
                  {{ okLabel }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isDateTimeControl,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  rankWith,
} from '@jsonforms/core';
import { defineComponent, ref } from 'vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue';
import {
  VBtn,
  // VDatePicker,
  VHover,
  VIcon,
  VMenu,
  VSpacer,
  VTextField,
  // VTimePicker,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardActions,
  VTabs,
  VTab,
  VWindowItem,
} from 'vuetify/components';
import { parseDateTime, useTranslator, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';
// import { VueMaskDirective as Mask } from 'v-mask';
import dayjs from 'dayjs';

const JSON_SCHEMA_DATE_TIME_FORMATS = [
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss',
];

// https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum
type AjvMinMaxFormat = {
  formatMinimum?: string | { $data: any };
  formatExclusiveMinimum?: string | { $data: any };
  formatMaximum?: string | { $data: any };
  formatExclusiveMaximum?: string | { $data: any };
};

const controlRenderer = defineComponent({
  name: 'datetime-control-renderer',
  components: {
    ControlWrapper,
    VBtn,
    // VDatePicker,
    // VTimePicker,
    VHover,
    VIcon,
    VMenu,
    VSpacer,
    VTextField,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardActions,
    VTabs,
    VTab,
    VWindowItem,
  },
  directives: { DisabledIconFocus },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const t = useTranslator();
    const showMenu = ref(false);
    const activeTab = ref('date');
    const mask = ref<((value: string) => (string | RegExp)[]) | undefined>(
      undefined
    );
    const adaptValue = (value: any) => value || undefined;

    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);
    return { ...control, showMenu, mask, t, adaptValue, activeTab };
  },
  watch: {
    showMenu(show) {
      if (!show) {
        // menu is closing then reset the activeTab
        this.activeTab = 'date';
      }
    },
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
        : 'mdi-calendar-clock';
    },
    useTabLayout(): boolean {
      if (this.$vuetify.display.smAndDown) {
        return true;
      }
      return false;
    },
    dateTimeFormat(): string {
      return typeof this.appliedOptions.dateTimeFormat == 'string'
        ? this.appliedOptions.dateTimeFormat
        : 'YYYY-MM-DD HH:mm';
    },
    dateTimeSaveFormat(): string {
      return typeof this.appliedOptions.dateTimeSaveFormat == 'string'
        ? this.appliedOptions.dateTimeSaveFormat
        : 'YYYY-MM-DDTHH:mm:ssZ';
    },
    formats(): string[] {
      return [
        this.dateTimeSaveFormat,
        this.dateTimeFormat,
        ...JSON_SCHEMA_DATE_TIME_FORMATS,
      ];
    },
    useSeconds(): boolean {
      return this.dateTimeFormat.includes('s') ? true : false;
    },
    ampm(): boolean {
      return this.appliedOptions.ampm === true;
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
        const date = parseDateTime(schema.formatMinimum, this.formats);
        return date ? date.format('YYYY-MM-DD') : schema.formatMinimum;
      } else if (typeof schema.formatExclusiveMinimum === 'string') {
        let date = parseDateTime(schema.formatExclusiveMinimum, this.formats);
        if (date) {
          // the format is exclusive
          date = date.add(1, 'second');
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
        const date = parseDateTime(schema.formatMaximum, this.formats);
        return date ? date.format('YYYY-MM-DD') : schema.formatMaximum;
      } else if (typeof schema.formatExclusiveMaximum === 'string') {
        let date = parseDateTime(schema.formatExclusiveMaximum, this.formats);
        if (date) {
          // the format is exclusive
          date = date.subtract(1, 'second');
        }
        return date ? date.format('YYYY-MM-DD') : schema.formatExclusiveMaximum;
      }
      return undefined;
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
        const time = parseDateTime(schema.formatMinimum, this.formats);
        const datePicker = this.$refs?.datePicker as { inputDate?: string };

        const date = parseDateTime(datePicker?.inputDate, 'YYYY-MM-DD');

        if (date && time && date.isSame(time, 'day')) {
          // time min only matters when it is the same day

          return this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm');
        }
        return undefined;
      } else if (typeof schema.formatExclusiveMinimum === 'string') {
        let time = parseDateTime(schema.formatExclusiveMinimum, this.formats);
        const datePicker = this.$refs?.datePicker as { inputDate?: string };
        const date = parseDateTime(datePicker?.inputDate, 'YYYY-MM-DD');

        if (date && time) {
          if (time) {
            time = this.useSeconds
              ? time.add(1, 'second')
              : time.add(1, 'minute');
          }

          if (date.isSame(time, 'day')) {
            return this.useSeconds
              ? time.format('HH:mm:ss')
              : time.format('HH:mm');
          }
        }

        return undefined;
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
        const time = parseDateTime(schema.formatMaximum, this.formats);
        const datePicker = this.$refs?.datePicker as { inputDate?: string };

        const date = parseDateTime(datePicker?.inputDate, 'YYYY-MM-DD');

        if (date && time && date.isSame(time, 'day')) {
          // time min only matters when it is the same day

          return this.useSeconds
            ? time.format('HH:mm:ss')
            : time.format('HH:mm');
        }

        return undefined;
      } else if (typeof schema.formatExclusiveMaximum === 'string') {
        let time = parseDateTime(schema.formatExclusiveMaximum, this.formats);
        const datePicker = this.$refs?.datePicker as { inputDate?: string };
        const date = parseDateTime(datePicker?.inputDate, 'YYYY-MM-DD');

        if (date && time) {
          if (time) {
            time = this.useSeconds
              ? time.subtract(1, 'second')
              : time.subtract(1, 'minute');
          }

          if (date.isSame(time, 'day')) {
            return this.useSeconds
              ? time.format('HH:mm:ss')
              : time.format('HH:mm');
          }
        }
        return undefined;
      }
      return undefined;
    },
    inputValue(): string | undefined {
      const value = this.control.data;
      const date = parseDateTime(value, this.formats);
      return date ? date.format(this.dateTimeFormat) : value;
    },
    datePickerValue: {
      get(): string | undefined {
        const value = this.control.data;

        const date = parseDateTime(value, this.formats);
        // show only valid values
        return date ? date.format('YYYY-MM-DD') : undefined;
      },
      set(val: string) {
        this.onPickerChange(val, this.timePickerValue);
      },
    },
    timePickerValue: {
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
        this.onPickerChange(this.datePickerValue, val);
      },
    },
    pickerValue: {
      get(): string | undefined {
        const value = this.control.data;

        const dateTime = parseDateTime(value, this.formats);
        // show only valid values
        return dateTime
          ? dateTime.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          : undefined;
      },
      set(val: string) {
        const dateTime = parseDateTime(val, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        if (dateTime && this.showActions) {
          this.onChange(dateTime.format(this.dateTimeSaveFormat));
        }
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
    onInputChange(value: string): void {
      const date = parseDateTime(value, this.dateTimeFormat);
      const newdata = date ? date.format(this.dateTimeSaveFormat) : value;
      if (this.adaptValue(newdata) !== this.control.data) {
        // only invoke onChange when values are different since v-mask is also listening on input which lead to loop
        this.onChange(newdata);
      }
    },
    onPickerChange(dateValue?: string, timeValue?: string): void {
      const date = parseDateTime(dateValue, 'YYYY-MM-DD');
      const time = parseDateTime(
        timeValue ?? (this.useSeconds ? '00:00:00' : '00:00'),
        this.useSeconds ? 'HH:mm:ss' : 'HH:mm'
      );
      if (date && time) {
        const dateTimeString = `${date.format('YYYY-MM-DD')}T${time.format(
          'HH:mm:ss.SSSZ'
        )}`;
        const dateTime = parseDateTime(
          dateTimeString,
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );
        this.onChange(dateTime!.format(this.dateTimeSaveFormat));
      }
    },
    okHandler(): void {
      (this.$refs.menu as any).save(this.pickerValue);
      this.showMenu = false;
    },
    onMinute(): void {
      if (!this.showActions && !this.useSeconds) {
        this.okHandler();
      }
    },
    onSecond(): void {
      if (!this.showActions && this.useSeconds) {
        this.okHandler();
      }
    },
    clear(): void {
      this.mask = undefined;
      this.onChange(null);
    },
    maskFunction(value: string): (string | RegExp)[] {
      const format = this.dateTimeFormat;

      const parts = format.split(
        /([^YMDHhmsAaSZ]*)(YYYY|YY|MMMM|MMM|MM|M|DD|D|hh?|HH?|mm?|ss?|a|A|SSS|Z)/
      );

      let index = 0;

      const result: (string | RegExp)[] = [];
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
          const months: string[] = [];

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
        } else if (part == 'H') {
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
  tester: rankWith(2, isDateTimeControl),
};
</script>

<!-- <style lang="scss" scoped>
.v-picker::v-deep {
  border-radius: 0px;

  .v-picker__title {
    min-height: 102px;
  }
}
</style> -->
