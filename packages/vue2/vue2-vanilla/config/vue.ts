/**
 * Switch between Vue 3 and Vue 2 '@vue/composition-api'.
 */
export { computed, defineComponent, inject, onBeforeMount, onUnmounted, reactive, ref, watch, watchEffect } from "vue";
export type { Ref } from "vue"; 
/**
 * Compatibility type as defineComponent of '@vue/composition-api' can't properly handle PropTypes.
 */
export type CompType<_S,V> = V;
