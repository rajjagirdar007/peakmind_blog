<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <button type="button" @click="signInWithGoogle" class="btn btn-google">
        <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://google.com&size=128" alt="Google" class="google-icon">
        Sign in with Google
      </button>
      
      <p class="mt-3 text-center">
        Don't have an account? 
        <router-link to="/signup">Sign up</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('signIn', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/');
      } catch (error) {
        console.error("Error logging in: ", error);
      }
    },
    async signInWithGoogle() {
      try {
        await this.$store.dispatch('signInWithGoogle');
        this.$router.push('/');
      } catch (error) {
        console.error("Error signing in with Google: ", error);
      }
    }
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: white;
  padding: 0 10px;
  color: #666;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: white;
  border: 1px solid #ddd;
  color: #444;
}

.google-icon {
  width: 18px;
  height: 18px;
}
</style>

