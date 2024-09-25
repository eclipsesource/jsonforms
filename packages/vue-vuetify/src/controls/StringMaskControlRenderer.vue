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
      :placeholder="appliedOptions.placeholder ?? appliedOptions.mask"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :maxlength="
        appliedOptions.restrict ? control.schema.maxLength : undefined
      "
      :counter="
        control.schema.maxLength !== undefined
          ? control.schema.maxLength
          : undefined
      "
      :clearable="control.enabled"
      @click:clear="clear"
      v-bind="vuetifyProps('v-text-field')"
      @focus="handleFocus"
      @blur="handleBlur"
      v-model="maskModel"
      v-maska:[options]
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  type ControlElement,
  type Tester,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  rendererProps,
  type RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue';
import isEmpty from 'lodash/isEmpty';
import { defineComponent, computed } from 'vue';
import { VTextField } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';
import { type MaskTokens, vMaska, Mask } from 'maska';
import cloneDeep from 'lodash/cloneDeep';

const defaultTokens: MaskTokens = {
  '#': { pattern: /[0-9]/ },
  '@': { pattern: /[a-zA-Z]/ },
  '*': { pattern: /[a-zA-Z0-9]/ },
};

const controlRenderer = defineComponent({
  name: 'string-mask-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  directives: {
    DisabledIconFocus,
    maska: vMaska,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) => value || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    const toTokens = (tokenParams: Record<string, any>): MaskTokens => {
      let tokens = cloneDeep(defaultTokens);
      if (tokenParams) {
        for (let key in tokenParams) {
          let value = tokenParams[key];

          if (value) {
            if (typeof value === 'string') {
              tokens[key] = {
                pattern: new RegExp(value),
              };
            } else {
              tokens[key] = {
                ...value,
                pattern: new RegExp(value.pattern),
              };
            }
          } else {
            delete tokens[key];
          }
        }
      }
      return tokens;
    };

    const tokens = computed(() => {
      let tokens: MaskTokens | undefined = undefined;

      if (control.appliedOptions.value.maskReplacers) {
        tokens = toTokens(control.appliedOptions.value.maskReplacers);
      }
      if (control.appliedOptions.value.tokens) {
        tokens = toTokens(control.appliedOptions.value.tokens);
      }

      if (!tokens) {
        tokens = defaultTokens;
      }

      return tokens;
    });

    const returnMaskedValue = computed(
      () => control.appliedOptions.value.returnMaskedValue === true,
    );
    const tokensReplace = computed(
      () =>
        control.appliedOptions.value.tokensReplace !==
        false /* default is true*/,
    );
    const eager = computed(
      () => control.appliedOptions.value.eager === false /* default is false*/,
    );
    const reversed = computed(
      () =>
        control.appliedOptions.value.reversed === false /* default is false*/,
    );

    const options = computed(() => ({
      mask: control.appliedOptions.value.mask,
      tokens: tokens.value,
      tokensReplace: tokensReplace.value,
      reversed: reversed.value,
      eager: eager.value,
    }));

    const mask = computed(() => new Mask(options.value));

    return {
      ...control,
      adaptValue,
      options,
      mask,
      returnMaskedValue,
      tokensReplace,
      eager,
      reversed,
    };
  },
  computed: {
    maskModel: {
      get(): string | undefined {
        return this.control.data;
      },
      set(val: string | undefined): void {
        let value = val;

        if (!this.returnMaskedValue && value) {
          value = this.mask.unmasked(value);
        }

        if (this.adaptValue(value) !== this.control.data) {
          // only invoke onChange when values are different since v-mask is also listening on input which lead to loop

          this.onChange(value);
        }
      },
    },
  },
  methods: {
    clear(): void {
      this.maskModel = undefined;
    },
  },
});

export default controlRenderer;

const hasOption =
  (optionName: string): Tester =>
  (uischema: UISchemaElement): boolean => {
    if (isEmpty(uischema)) {
      return false;
    }

    const options = uischema.options;
    return (
      (options &&
        !isEmpty(options) &&
        typeof options[optionName] === 'string') ||
      false
    );
  };
</script>
