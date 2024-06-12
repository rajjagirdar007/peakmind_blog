<template>
  <div id="app">
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
            <li class="nav-item" v-if="isLoggedIn">
              <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link class="nav-link" to="/admin">Admin</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <button @click="logout" class="btn btn-outline-light">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.isLoggedIn = false;
        this.$router.push('/login');
      });
    }
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      this.isLoggedIn = !!user;
    });
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

