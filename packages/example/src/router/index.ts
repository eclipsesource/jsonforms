import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  scrollBehavior: (to, _, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      component: () => import('../layouts/default/index.vue'),
      children: [
        {
          path: '',
          name: 'Default',
          component: () => import('../views/home'),
        },
        {
          path: 'example/:id',
          name: 'example',
          component: () => import('../views/example'),
        },
      ],
    },
  ],
});
