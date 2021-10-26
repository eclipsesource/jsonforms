<template>
  <v-navigation-drawer
    app
    clipped
    :clipped-left="!$vuetify.rtl"
    :clipped-right="$vuetify.rtl"
    :right="$vuetify.rtl"
    v-model="drawer"
  >
    <v-list-item>
      <v-list-item-icon>
        <v-img
          :src="require('@/assets/vuetify.svg')"
          max-height="64"
          max-width="64"
        />
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> Examples </v-list-item-title>
        <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="example in examples" :key="example.title" link>
        <v-list-item-content
          @click="
            if ($route.name !== 'example' || $route.params.id !== example.id)
              $router.push({ name: 'example', params: { id: example.id } });
          "
        >
          <v-list-item-title>{{ example.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { examples } from '@/examples';

export default {
  name: 'DefaultDrawer',
  data() {
    return {
      examples,
    };
  },
  computed: {
    drawer: sync('app/drawer'),
  },
};
</script>
