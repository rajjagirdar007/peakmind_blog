import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import BlogPost from '../views/BlogPost.vue';
import Category from '../views/Category.vue';
import Tag from '../views/Tag.vue';
import Author from '../views/Author.vue';
import Admin from '../views/Admin.vue';
import Login from '../views/Login.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'BlogPost',
      component: BlogPost
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category
    },
    {
      path: '/tag/:id',
      name: 'Tag',
      component: Tag
    },
    {
      path: '/author/:id',
      name: 'Author',
      component: Author
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const auth = getAuth();
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;

