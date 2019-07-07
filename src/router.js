import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'explore'
    },
    {
      path: '/explore',
      name: 'explore',
      component: () =>
        import(/* webpackChunkName: 'explore' */ './views/Explore.vue')
    },
    {
      path: '/explore/:quizId',
      props: true,
      name: 'view-quiz',
      component: () =>
        import(/* webpackChunkName: 'view-quiz' */ './views/Quiz.vue')
    },
    {
      path: '/create',
      name: 'create',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import(/* webpackChunkName: 'create-quiz' */ './views/CreateQuiz.vue')
    },
    {
      path: '/session/:sessionId',
      name: 'session',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import(/* webpackChunkName: 'session' */ './views/Session.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token'))
    next({ name: 'explore', query: { auth: true } });
  else
    next();
});

export default router;