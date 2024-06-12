import Vue from 'vue';
import Vuex from 'vuex';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../main';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    categories: [],
    tags: [],
    authors: [],
    comments: {}
  },
  mutations: {
    setPosts(state, posts) {
      state.posts = posts;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setTags(state, tags) {
      state.tags = tags;
    },
    setAuthors(state, authors) {
      state.authors = authors;
    },
    setComments(state, { postId, comments }) {
      Vue.set(state.comments, postId, comments);
    }
  },
  actions: {
    async fetchPosts({ commit }) {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setPosts', posts);
    },
    async fetchCategories({ commit }) {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setCategories', categories);
    },
    async fetchTags({ commit }) {
      const snapshot = await getDocs(collection(db, 'tags'));
      const tags = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setTags', tags);
    },
    async fetchAuthors({ commit }) {
      const snapshot = await getDocs(collection(db, 'authors'));
      const authors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setAuthors', authors);
    },
    async fetchComments({ commit }, postId) {
      const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setComments', { postId, comments });
    }
  },
  modules: {}
});

