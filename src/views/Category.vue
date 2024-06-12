<template>
  <div class="category">
    <h1>{{ category.name }}</h1>
    <div v-for="post in categoryPosts" :key="post.id" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text">{{ post.excerpt }}</p>
        <router-link :to="{ name: 'BlogPost', params: { id: post.id } }" class="btn btn-primary">Read More</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category: {},
      categoryPosts: []
    };
  },
  created() {
    const categoryId = this.$route.params.id;
    this.$store.dispatch('fetchCategories').then(() => {
      this.category = this.$store.state.categories.find(category => category.id === categoryId);
    });
    this.$store.dispatch('fetchPosts').then(() => {
      this.categoryPosts = this.$store.state.posts.filter(post => post.categoryId === categoryId);
    });
  }
}
</script>

<style scoped>
.category {
  padding: 20px;
}
</style>

