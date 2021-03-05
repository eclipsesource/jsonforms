import { PropType } from "vue";

/**
 * Switch between Vue 3 and Vue 2 '@vue/composition-api'.
 */
export { computed, defineComponent, inject, reactive, ref, watch, watchEffect } from "vue";
export type { Ref } from "vue";
/**
 * Compatibility type as defineComponent of '@vue/composition-api' can't properly handle PropTypes.
 */
export type CompType<S,_V> = PropType<S>
