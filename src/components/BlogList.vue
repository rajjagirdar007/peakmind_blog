<template>
  <div class="blog-list container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Blog Posts</h2>
      <div>
        <button @click="setLayout('grid')" :class="{'btn-secondary': layout === 'grid', 'btn-outline-secondary': layout !== 'grid'}" class="btn btn-sm">Grid</button>
        <button @click="setLayout('row')" :class="{'btn-secondary': layout === 'row', 'btn-outline-secondary': layout !== 'row'}" class="btn btn-sm">Row</button>
      </div>
    </div>
    <div v-if="layout === 'grid'" class="row">
      <div v-for="post in posts" :key="post.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 border-0 shadow-sm">
          <img :src="post.imageUrl" class="card-img-top" alt="Post image">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.excerpt }}</p>
            <router-link :to="{ name: 'BlogPost', params: { id: post.id } }" class="btn btn-primary">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-if="layout === 'row'" class="list-group">
      <div v-for="post in posts" :key="post.id" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ post.title }}</h5>
          <small>{{ post.date }}</small>
        </div>
        <p class="mb-1">{{ post.excerpt }}</p>
        <small><router-link :to="{ name: 'BlogPost', params: { id: post.id } }">Read More</router-link></small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layout: 'grid' // default layout
    };
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    }
  },
  methods: {
    setLayout(layout) {
      this.layout = layout;
    }
  },
  created() {
    this.$store.dispatch('fetchPosts');
  }
}
</script>

<style scoped>
.blog-list {
  padding: 40px 0;
}
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 15px;
}
.card-text {
  color: #6c757d;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.2s, border-color 0.2s;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
.list-group-item {
  transition: transform 0.2s, box-shadow 0.2s;
}
.list-group-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.list-group-item h5 {
  font-size: 1.25rem;
  font-weight: 700;
}
.list-group-item p {
  color: #6c757d;
}
</style>

