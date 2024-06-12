import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAGXXQS8KcOJy2fCOodNhVOk9_8pVZYy_w",
  authDomain: "peakmind-website.firebaseapp.com",
  projectId: "peakmind-website",
  storageBucket: "peakmind-website.appspot.com",
  messagingSenderId: "868859025092",
  appId: "1:868859025092:web:9f4cfcdc0e448fd4551b91",
  measurementId: "G-ZVCJHZGBP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export { db, auth };

