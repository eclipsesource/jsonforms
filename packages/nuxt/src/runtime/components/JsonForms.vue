<template>
  <VueJsonForms
    :renderers="finalRenderers"
    :data="data"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core'
import type { MaybeReadonly, JsonFormsChangeEvent } from '@jsonforms/vue'
import type { PropType } from 'vue'
import { computed } from 'vue'
import { defaultRenderers } from '#imports'

const props = defineProps<{
  renderers?: PropType<MaybeReadonly<JsonFormsRendererRegistryEntry[]>>
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = defineModel<any>()

const finalRenderers = computed(() => {
  if (props.renderers) {
    return props.renderers
  }
  return defaultRenderers || null
})

const onChange = (event: JsonFormsChangeEvent) => {
  data.value = event.data
}
</script>
