<template>
  <v-input
    v-if="control.visible"
    :id="control.id + '-input'"
    :class="styles.control.input"
    :disabled="!control.enabled"
    :autofocus="appliedOptions.focus"
    :placeholder="appliedOptions.placeholder"
    :hint="control.description"
    :persistent-hint="persistentHint()"
    :required="control.required"
    :error-messages="control.errors"
    v-bind="vuetifyProps(`v-input`)"
    #default="{ id, isDisabled, isDirty }"
  >
    <v-field
      :id="id.value"
      :error="!!control.errors"
      :disabled="isDisabled.value"
      :active="true"
      :dirty="isDirty.value"
      :focused="isFocused"
      :label="computedLabel"
      v-bind="vuetifyProps(`v-field`)"
    >
      <div :class="checkboxGroupClasses">
        <v-checkbox
          v-for="(o, index) in control.options"
          :key="o.value"
          :label="o.label"
          :model-value="dataHasEnum(o.value)"
          :id="control.id + `-input-${index}`"
          :path="composePaths(control.path, `${index}`)"
          :error-messages="control.errors"
          hide-details
          :disabled="!control.enabled"
          :indeterminate="control.data === undefined"
          v-bind="vuetifyProps(`v-checkbox[${o.value}]`)"
          @update:model-value="() => toggle(o.value)"
          @focus="handleFocus"
          @blur="handleBlur"
        ></v-checkbox>
      </div>
    </v-field>
  </v-input>
</template>

<script lang="ts">
import { composePaths, type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  type RendererProps,
  useJsonFormsMultiEnumControl,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VCheckbox, VField, VInput } from 'vuetify/components';
import { useVuetifyControl } from '../util';

const controlRenderer = defineComponent({
  name: 'enum-array-renderer',
  components: {
    VCheckbox,
    VInput,
    VField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsMultiEnumControl(props));
  },
  methods: {
    dataHasEnum(value: any) {
      return !!this.control.data?.includes(value);
    },
    composePaths,
    toggle(value: any) {
      if (!this.dataHasEnum(value)) {
        this.addItem(this.control.path, value);
      } else {
        // mistyped in core
        this.removeItem?.(this.control.path, value);
      }
    },
  },
  computed: {
    checkboxGroupClasses() {
      const classes = ['d-flex'];
      if (this.appliedOptions.vertical) {
        classes.push('flex-column');
      }
      const VField = this.$vuetify.defaults
        ? this.$vuetify.defaults['VField']
        : undefined;
      const variant = VField?.variant as any;

      if (variant !== 'outlined' && this.computedLabel) {
        classes.push('mt-4');
      }
      return classes;
    },
  },
});

export default controlRenderer;
</script>
