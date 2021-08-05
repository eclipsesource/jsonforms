<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <json-forms-demo />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import JsonFormsDemo from './components/JsonFormsDemo.vue';

export default Vue.extend({
  name: 'App',
  components: {
    JsonFormsDemo,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
