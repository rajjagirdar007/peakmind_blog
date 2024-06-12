<template>
  <div class="tag">
    <h1>{{ tag.name }}</h1>
    <div v-for="post in tagPosts" :key="post.id" class="card mb-3">
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
      tag: {},
      tagPosts: []
    };
  },
  created() {
    const tagId = this.$route.params.id;
    this.$store.dispatch('fetchTags').then(() => {
      this.tag = this.$store.state.tags.find(tag => tag.id === tagId);
    });
    this.$store.dispatch('fetchPosts').then(() => {
      this.tagPosts = this.$store.state.posts.filter(post => post.tagIds.includes(tagId));
    });
  }
}
</script>

<style scoped>
.tag {
  padding: 20px;
}
</style>

