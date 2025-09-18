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
  console.log('form change', event)
  data.value = event.data
}
</script>
