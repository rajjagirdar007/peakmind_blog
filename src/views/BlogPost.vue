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
    <div class="actions mt-4" v-if="post">
      <button v-if="canEdit" 
              @click="$router.push(`/edit-post/${post.id}`)" 
              class="btn btn-primary me-2">
        Edit Post
      </button>
      <button v-if="canEdit" 
              @click="handleDelete" 
              class="btn btn-danger me-2">
        Delete Post
      </button>
      <button v-if="isViewer" 
              @click="handleSave" 
              class="btn btn-outline-primary">
        Save Post
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RelatedPosts from '../components/RelatedPosts.vue';
import CommentSection from '../components/CommentSection.vue';

export default {
  components: {
    RelatedPosts,
    CommentSection
  },
  data() {
    return {
      post: null,
      author: null
    };
  },
  computed: {
    ...mapGetters(['isAdmin', 'isBlogger', 'currentUser', 'canEditPost']),
    
    canEdit() {
      return this.post && this.canEditPost(this.post.authorId);
    }
  },
  methods: {
    ...mapActions(['fetchPost', 'deletePost', 'savePost']),
    
    async handleDelete() {
      if (confirm('Are you sure you want to delete this post?')) {
        try {
          await this.deletePost({
            postId: this.post.id,
            imageUrl: this.post.imageUrl
          });
          this.$router.push('/');
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    },

    async handleSave() {
      if (this.isViewer) {
        try {
          await this.savePost(this.post.id);
        } catch (error) {
          console.error('Error saving post:', error);
        }
      }
    }
  },
  async created() {
    const postId = this.$route.params.id;
    try {
      this.post = await this.fetchPost(postId);
    } catch (error) {
      console.error('Error fetching post:', error);
      this.$router.push('/404');
    }
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

