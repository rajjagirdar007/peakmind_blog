<template>
  <div class="author">
    <h1>{{ author.name }}</h1>
    <p>{{ author.bio }}</p>
    <div v-for="post in authorPosts" :key="post.id" class="card mb-3">
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
      author: {},
      authorPosts: []
    };
  },
  created() {
    const authorId = this.$route.params.id;
    this.$store.dispatch('fetchAuthors').then(() => {
      this.author = this.$store.state.authors.find(author => author.id === authorId);
    });
    this.$store.dispatch('fetchPosts').then(() => {
      this.authorPosts = this.$store.state.posts.filter(post => post.authorId === authorId);
    });
  }
}
</script>

<style scoped>
.author {
  padding: 20px;
}
</style>

