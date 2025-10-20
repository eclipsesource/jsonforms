<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      :type="showPassword ? 'text' : 'password'"
      :append-icon="
        showPassword
          ? icons.current.value.passwordHide
          : icons.current.value.passwordShow
      "
      @click:append="() => (showPassword = !showPassword)"
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
      :model-value="control.data"
      :maxlength="
        appliedOptions.restrict ? control.schema.maxLength : undefined
      "
      :size="
        appliedOptions.trim && control.schema.maxLength !== undefined
          ? control.schema.maxLength
          : undefined
      "
      v-bind="vuetifyProps('v-text-field')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent, ref } from 'vue';
import { VTextField } from 'vuetify/components';
import { useIcons, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'password-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const showPassword = ref(false);
    const icons = useIcons();

    return {
      ...useVuetifyControl(
        useJsonFormsControl(props),
        (value) => value || undefined,
        300,
      ),
      showPassword,
      icons,
    };
  },
});

export default controlRenderer;
</script>
