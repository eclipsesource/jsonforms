<template>
  <div>
    <v-tooltip bottom v-if="errors.length > 0">
      <template v-slot:activator="{ props }">
        <v-badge
          :color="color"
          :bordered="bordered"
          :inline="inline"
          :offsetX="offsetX"
          :offsetY="offsetY"
          :floating="floating"
        >
          <template v-slot:badge>
            {{ errors.length }}
          </template>
          <div v-bind="props"><slot></slot></div>
        </v-badge>
      </template>

      <p>Validation Errors</p>
      <p
        v-for="(message, index) in tooltipMessages"
        :key="`${index}`"
        class="mb-0"
      >
        {{ message }}
      </p>
    </v-tooltip>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VBadge, VTooltip } from 'vuetify/components';
import type { ErrorObject } from 'ajv';
import findIndex from 'lodash/findIndex';
import {
  createControlElement,
  createLabelDescriptionFrom,
  type JsonSchema,
} from '@jsonforms/core';

export default defineComponent({
  name: 'validation-badge',
  components: {
    VBadge,
    VTooltip,
  },
  props: {
    errors: {
      required: true,
      type: Array as PropType<ErrorObject[]>,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'error',
    },
    inline: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: [Number, String],
      default: undefined,
    },
    offsetY: {
      type: [Number, String],
      default: undefined,
    },
    floating: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tooltipMessages(): string[] {
      const error: {
        instancePath: string;
        schemaPath: string;
        labels: (string | undefined)[];
        message: string;
      }[] = [];

      for (const e of this.errors) {
        const errorObject = e as ErrorObject;
        const index = findIndex(error, { schemaPath: errorObject.schemaPath });
        if (errorObject.message) {
          if (index == -1) {
            error.push({
              schemaPath: errorObject.schemaPath,
              instancePath: errorObject.instancePath,
              labels: [
                createLabelDescriptionFrom(
                  createControlElement(errorObject.instancePath),
                  errorObject.schema as JsonSchema,
                ).text,
              ],
              message: errorObject.message,
            });
          } else {
            error[index].labels.push(
              createLabelDescriptionFrom(
                createControlElement(errorObject.instancePath),
                errorObject.schema as JsonSchema,
              ).text,
            );
          }
        }
      }

      return error.map((v) => v.labels.join(',') + ': ' + v.message);
    },
  },
});
</script>
