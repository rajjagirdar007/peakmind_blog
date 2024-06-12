<template>
  <div class="blog-post container">
    <div class="header text-center my-5">
      <h1>{{ post.title }}</h1>
      <p class="text-muted">{{ post.date }}</p>
      <img :src="post.imageUrl" class="img-fluid rounded" alt="Post image">
    </div>
    <div class="content my-5">
      <p v-html="post.content" class="lead"></p>
    </div>
    <div class="related-posts my-5">
      <h2>Related Posts</h2>
      <related-posts :postId="post.id"></related-posts>
    </div>
    <div class="comment-section my-5">
      <h2>Comments</h2>
      <comment-section :postId="post.id"></comment-section>
    </div>
  </div>
</template>

<script>
import RelatedPosts from '../components/RelatedPosts.vue';
import CommentSection from '../components/CommentSection.vue';

export default {
  components: {
    RelatedPosts,
    CommentSection
  },
  data() {
    return {
      post: {}
    };
  },
  created() {
    const postId = this.$route.params.id;
    this.$store.dispatch('fetchPosts').then(() => {
      this.post = this.$store.state.posts.find(post => post.id === postId);
    });
  }
}
</script>

<style scoped>
.blog-post {
  padding: 40px 0;
}
.header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}
.header p {
  font-size: 1rem;
  color: #6c757d;
}
.header img {
  margin-top: 20px;
}
.content p {
  font-size: 1.25rem;
  line-height: 1.6;
}
.related-posts h2,
.comment-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}
</style>

