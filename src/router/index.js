import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import BlogPost from '../views/BlogPost.vue';
import Category from '../views/Category.vue';
import Tag from '../views/Tag.vue';
import Author from '../views/Author.vue';
import Admin from '../views/Admin.vue';
import Login from '../views/Login.vue';
import Unauthorized from '../views/Unauthorized.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

Vue.use(Router);

const router = new Router({
    routes: [{
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
            meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/unauthorized',
            name: 'Unauthorized',
            component: Unauthorized
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: () =>
                import ('../views/SignUp.vue')
        }
    ]
});

router.beforeEach(async(to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    const requiresBlogger = to.matched.some(record => record.meta.requiresBlogger);

    try {
        const user = await new Promise((resolve) => {
            const unsubscribe = getAuth().onAuthStateChanged((user) => {
                unsubscribe();
                resolve(user);
            });
        });

        if (requiresAuth && !user) {
            next('/login');
        } else if (requiresAdmin && !router.app.$store.state.userRole === 'admin') {
            next('/unauthorized');
        } else if (requiresBlogger && !router.app.$store.getters.isBlogger) {
            next('/unauthorized');
        } else {
            next();
        }
    } catch (error) {
        console.error('Navigation guard error:', error);
        next('/login');
    }
});

export default router;