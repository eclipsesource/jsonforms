/**
 * Switch between Vue 3 and Vue 2 '@vue/composition-api'.
 */
export { computed, defineComponent, inject, onBeforeMount, onUnmounted, reactive, ref, watch, watchEffect } from "@vue/composition-api";
export type { Ref } from "@vue/composition-api"; 
/**
 * Compatibility type as defineComponent of '@vue/composition-api' can't properly handle PropTypes.
 */
export type CompType<_S,V> = V;
