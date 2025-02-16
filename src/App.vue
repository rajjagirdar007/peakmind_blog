<template>
  <div id="app">
    <template v-if="authReady">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <router-link class="navbar-brand" to="/">PeakMind</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Home</router-link>
              </li>
              <li class="nav-item" v-if="isAuthenticated">
                <router-link class="nav-link" to="/profile">Profile</router-link>
              </li>
              <li class="nav-item" v-if="isAdmin">
                <router-link class="nav-link" to="/admin">Admin</router-link>
              </li>
            </ul>
            <ul class="navbar-nav ml-auto">
              <li class="nav-item" v-if="!isAuthenticated">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item" v-if="isAuthenticated">
                <button @click="logout" class="btn btn-outline-light">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <router-view />
    </template>
    <div v-else class="loading-screen">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated', 'authReady'])
  },
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        await this.$store.dispatch('signOut');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  }
}
</script>
<style>
@import 'bootstrap/dist/css/bootstrap.css';

.navbar {
  background-color: #1e1e1e !important;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
  color: #f8f9fa !important;
}

.navbar-nav .nav-link {
  margin-right: 20px;
  font-size: 1.1rem;
  color: #f8f9fa !important;
}

.navbar-toggler {
  border: none;
}

.btn-outline-light {
  margin-left: 10px;
}

.navbar-collapse {
  justify-content: space-between;
}

@media (max-width: 767.98px) {
  .navbar-nav {
    text-align: center;
  }
}
</style>

