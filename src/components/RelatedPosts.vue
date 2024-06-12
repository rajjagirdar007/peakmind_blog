<template>
  <div class="row">
    <div v-for="post in relatedPosts" :key="post.id" class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 border-0 shadow-sm">
        <img :src="post.imageUrl" class="card-img-top" alt="Related post image">
        <div class="card-body">
          <h5 class="card-title">{{ post.title }}</h5>
          <p class="card-text">{{ post.excerpt }}</p>
          <router-link :to="{ name: 'BlogPost', params: { id: post.id } }" class="btn btn-primary">Read More</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['postId'],
  data() {
    return {
      relatedPosts: []
    };
  },
  created() {
    this.fetchRelatedPosts();
  },
  methods: {
    fetchRelatedPosts() {
      // Implement logic to fetch related posts
    }
  }
}
</script>

<style scoped>
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
</style>

