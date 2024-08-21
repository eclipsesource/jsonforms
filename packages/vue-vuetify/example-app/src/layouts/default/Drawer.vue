<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.rtl ? 'right' : 'left'"
  >
    <v-list-item>
      <template v-slot:prepend>
        <v-img
          :src="require('@/assets/vuetify.svg')"
          max-height="64"
          max-width="64"
        />
      </template>
      <v-list-item-title class="text-h6"> Examples </v-list-item-title>
      <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="example in examples" :key="example.title" link>
        <v-list-item-title
          @click="
            if ($route.name !== 'example' || $route.params.id !== example.id)
              $router.push({ name: 'example', params: { id: example.id } });
          "
          >{{ example.title }}</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { examples } from '@/examples';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultDrawer',
  setup() {
    const drawer = sync('app/drawer');
    return {
      drawer,
    };
  },
  data() {
    return {
      examples,
    };
  },
});
</script>
