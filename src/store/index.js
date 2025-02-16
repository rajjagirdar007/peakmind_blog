import Vue from 'vue';
import Vuex from 'vuex';
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    query,
    orderBy,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    where
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { db } from '../main';
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { storage } from '../main';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Firebase Collections:
        // - users: Stores user profiles with fields: name, email, bio, role, createdAt, savedPosts
        // - posts: Stores blog posts with fields: title, content, excerpt, imageUrl, categoryId, authorId, createdAt, tagIds
        // - categories: Stores post categories with fields: name, description
        // - tags: Stores post tags with fields: name
        // - authors: Stores author info with fields: name, bio, avatar
        // - comments: Stores post comments with fields: postId, userId, content, date

        // Firebase Authentication:
        // - Email/Password authentication enabled
        // - User UID from auth links to users collection

        user: null, // Firebase Auth user object
        userProfile: null, // User document from users collection
        posts: [], // Array of post documents
        categories: [], // Array of category documents
        tags: [], // Array of tag documents
        authors: [], // Array of author documents
        comments: {}, // Object of comments by postId
        loading: false, // Loading state
        error: null, // Error state
        userRole: null, // 'admin', 'blogger', or 'viewer'
        savedPosts: [], // Array of saved post IDs for viewers
        bloggers: [],
        authReady: false, // New state to track auth initialization
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setUserProfile(state, profile) {
            console.log(state.userRole);
            if (profile) {
                state.userProfile = profile;
                state.userRole = profile.role;
                console.log(state.userRole);
            }
        },


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
        },
        setLoading(state, status) {
            state.loading = status;
        },
        setError(state, error) {
            state.error = error;
        },
        setUserRole(state, role) {
            state.userRole = role;
        },
        setSavedPosts(state, posts) {
            state.savedPosts = posts;
        },
        setBloggers(state, bloggers) {
            state.bloggers = bloggers;
        },
        setAuthReady(state, ready) {
            state.authReady = ready;
        }
    },
    actions: {
        // Auth actions
        async signUp({ commit, dispatch }, { email, password, name, role = 'viewer' }) {
            try {
                commit('setLoading', true);
                const auth = getAuth();
                const { user } = await createUserWithEmailAndPassword(auth, email, password);

                // Create user profile with role
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email,
                    role,
                    createdAt: new Date(),
                    savedPosts: [], // Initialize empty saved posts array
                    bio: '', // Optional: add default bio
                    photoURL: user.photoURL || '', // Optional: add default photo URL
                });

                await dispatch('fetchUserProfile', user);
                return user;
            } catch (error) {
                commit('setError', error.message);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },

        async signIn({ commit, dispatch }, { email, password }) {
            try {
                commit('setLoading', true);
                const auth = getAuth();
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                dispatch('fetchUserProfile', user);
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        async signOut({ commit }) {
            try {
                const auth = getAuth();
                await signOut(auth);
                commit('setUser', null);
                commit('setUserProfile', null);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async fetchUserProfile({ commit, dispatch }, user) {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    commit('setUserProfile', userData);
                    console.log(userData);
                    commit('setUserRole', userData.role);
                    console.log(userData.role);
                    console.log(this.state.userRole);
                    console.log(this.state.getters.isAdmin());
                    commit('setUser', user);

                    // Fetch saved posts for viewers
                    if (userData.role === 'viewer') {
                        await dispatch('fetchSavedPosts');
                    }
                }
            } catch (error) {
                commit('setError', error.message);
            }
        },

        // Post actions
        async createPost({ state, commit }, { post, image }) {
            try {
                commit('setLoading', true);
                let imageUrl = '';

                // Upload image if provided
                if (image) {
                    const imageRef = storageRef(storage, `posts/${Date.now()}_${image.name}`);
                    await uploadBytes(imageRef, image);
                    imageUrl = await getDownloadURL(imageRef);
                }

                const newPost = {
                    ...post,
                    imageUrl,
                    authorId: state.user.uid,
                    createdAt: new Date()
                };

                await setDoc(doc(collection(db, 'posts')), newPost);
                dispatch('fetchPosts');
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        async fetchPosts({ commit }) {
            console.log(this.state.userRole);
            try {
                commit('setLoading', true);
                const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commit('setPosts', posts);
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        async fetchCategories({ commit }) {
            try {
                const snapshot = await getDocs(collection(db, 'categories'));
                const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commit('setCategories', categories);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async fetchTags({ commit }) {
            try {
                const snapshot = await getDocs(collection(db, 'tags'));
                const tags = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commit('setTags', tags);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async fetchAuthors({ commit }) {
            try {
                const snapshot = await getDocs(collection(db, 'authors'));
                const authors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commit('setAuthors', authors);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async fetchComments({ commit }, postId) {
            try {
                const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commit('setComments', { postId, comments });
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async addComment({ state, commit }, { postId, content }) {
            try {
                const newComment = {
                    content,
                    authorId: state.user.uid,
                    createdAt: new Date()
                };
                await setDoc(doc(collection(db, 'posts', postId, 'comments')), newComment);
                dispatch('fetchComments', postId);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async deletePost({ commit }, { postId, imageUrl }) {
            try {
                commit('setLoading', true);

                // Delete image from storage if exists
                if (imageUrl) {
                    const imageRef = storageRef(storage, imageUrl);
                    await deleteObject(imageRef);
                }

                await deleteDoc(doc(db, 'posts', postId));
                dispatch('fetchPosts');
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        // Viewer-specific actions
        async savePost({ state, commit }, postId) {
            try {
                const userRef = doc(db, 'users', state.user.uid);
                await updateDoc(userRef, {
                    savedPosts: [...state.savedPosts, postId]
                });
                commit('setSavedPosts', [...state.savedPosts, postId]);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async fetchSavedPosts({ state, commit }) {
            try {
                const snapshot = await getDocs(doc(db, 'users', state.user.uid));
                const userData = snapshot.data();
                commit('setSavedPosts', userData.savedPosts || []);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async createBloggerAccount({ commit }, bloggerData) {
            try {
                commit('setLoading', true);
                const auth = getAuth();

                // Create authentication account
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    bloggerData.email,
                    bloggerData.password
                );

                // Create user profile
                await setDoc(doc(db, 'users', user.uid), {
                    name: bloggerData.name,
                    email: bloggerData.email,
                    bio: bloggerData.bio,
                    role: 'blogger',
                    createdAt: new Date()
                });

                dispatch('fetchBloggers');
            } catch (error) {
                commit('setError', error.message);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },

        async deleteBloggerAccount({ commit }, bloggerId) {
            try {
                commit('setLoading', true);

                // Delete user's posts
                const postsSnapshot = await getDocs(
                    query(collection(db, 'posts'), where('authorId', '==', bloggerId))
                );

                const deletions = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
                await Promise.all(deletions);

                // Delete user profile
                await deleteDoc(doc(db, 'users', bloggerId));

                // Delete authentication account
                const auth = getAuth();
                await auth.deleteUser(bloggerId);

                dispatch('fetchBloggers');
            } catch (error) {
                commit('setError', error.message);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },

        async fetchBloggers({ commit }) {
            try {
                commit('setLoading', true);
                const snapshot = await getDocs(
                    query(collection(db, 'users'), where('role', '==', 'blogger'))
                );

                const bloggers = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                commit('setBloggers', bloggers);
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        async signInWithGoogle({ commit, dispatch }) {
            try {
                commit('setLoading', true);
                const auth = getAuth();
                const provider = new GoogleAuthProvider();
                const { user } = await signInWithPopup(auth, provider);

                // Check if user document exists
                const userDoc = await getDocs(doc(db, 'users', user.uid));

                if (!userDoc.exists()) {
                    // Create new user profile if first time signing in
                    await setDoc(doc(db, 'users', user.uid), {
                        name: user.displayName,
                        email: user.email,
                        role: 'viewer', // Default role
                        createdAt: new Date(),
                        photoURL: user.photoURL,
                        savedPosts: [] // Initialize empty saved posts array
                    });
                }

                dispatch('fetchUserProfile', user);
            } catch (error) {
                commit('setError', error.message);
            } finally {
                commit('setLoading', false);
            }
        },

        async initializeAuth({ commit, dispatch }) {
            const auth = getAuth();

            return new Promise((resolve) => {
                // Set up persistent auth state observer
                onAuthStateChanged(auth, async(user) => {
                    if (user) {
                        commit('setUser', user);
                        await dispatch('fetchUserProfile', user);
                    } else {
                        commit('setUser', null);
                        commit('setUserProfile', null);
                    }
                    commit('setAuthReady', true);
                    resolve(user);
                });
            });
        }
    },
    getters: {
        isAuthenticated: state => !!state.user,
        currentUser: state => state.user,
        userProfile: state => state.userProfile,
        loading: state => state.loading,
        error: state => state.error,
        isAdmin: state => state.userRole === 'admin',
        isBlogger: state => state.userRole === 'blogger',
        isViewer: state => state.userRole === 'viewer',
        canEditPost: (state) => (authorId) => {
            return state.userRole === 'admin' ||
                (state.userRole === 'blogger' && state.user.uid === authorId);
        },
        savedPosts: state => state.savedPosts,
        bloggers: state => state.bloggers,
        authReady: state => state.authReady
    },
    modules: {}
});