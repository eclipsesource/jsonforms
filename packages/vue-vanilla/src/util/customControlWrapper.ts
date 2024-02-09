import type { Component } from 'vue';

export interface CustomControllWrapper {
  component: Component;
  props?: Record<string, any>;
}
