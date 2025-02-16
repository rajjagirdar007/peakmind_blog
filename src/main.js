import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCPoyKJtDMVdHW9djo-hThcaD6ptMhwg2U",
    authDomain: "blog-peakmind.firebaseapp.com",
    projectId: "blog-peakmind",
    storageBucket: "blog-peakmind.firebasestorage.app",
    messagingSenderId: "324663637798",
    appId: "1:324663637798:web:c1176af1b7f66284f633e7",
    measurementId: "G-HKQBKBT04W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export for use in other files
export { db, auth, storage };

let vueApp;

// Wait for Firebase Auth to initialize before creating the app
onAuthStateChanged(auth, async(user) => {
    if (!vueApp) {
        await store.dispatch('initializeAuth');

        vueApp = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app');
    }
});