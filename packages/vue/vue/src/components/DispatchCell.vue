<template>
  <component v-bind:is="determinedCell" v-bind="cell"></component>
</template>

<script lang="ts">
import { defineComponent } from '../../config';
import UnknownRenderer from './UnknownRenderer.vue';
import maxBy from 'lodash/maxBy';
import {
  rendererProps,
  useJsonFormsDispatchCell
} from '../jsonFormsCompositions';
import { ControlElement } from '@jsonforms/core';

export default defineComponent({
  name: 'dispatch-cell',
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props) {
    return useJsonFormsDispatchCell(props);
  },
  computed: {
    determinedCell(): any {
      const cell = maxBy(this.cell.cells, r =>
        r.tester(this.cell.uischema, this.cell.schema, this.cell.rootSchema)
      );
      if (
        cell === undefined ||
        cell.tester(this.cell.uischema, this.cell.schema, this.cell.rootSchema) === -1
      ) {
        return UnknownRenderer;
      } else {
        return cell.cell;
      }
    }
  }
});
</script>
