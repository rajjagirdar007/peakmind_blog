<template>
  <div>
    <div v-if="comments.length === 0" class="alert alert-info">
      No comments yet. Be the first to comment!
    </div>
    <div v-for="comment in comments" :key="comment.id" class="comment mb-4 p-3 border rounded">
      <p class="mb-1"><strong>{{ comment.author }}</strong> <small class="text-muted">{{ comment.createdAt }}</small></p>
      <p>{{ comment.content }}</p>
    </div>
    <div class="add-comment mt-5">
      <h4>Add a Comment</h4>
      <form @submit.prevent="addComment">
        <div class="form-group mb-3">
          <label for="author">Your Name</label>
          <input v-model="newCommentAuthor" type="text" id="author" class="form-control" required>
        </div>
        <div class="form-group mb-3">
          <label for="content">Your Comment</label>
          <input v-model="newCommentContent" type="text" id="content" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../main';

export default {
  props: ['postId'],
  data() {
    return {
      comments: [],
      newCommentAuthor: '',
      newCommentContent: ''
    };
  },
  watch: {
    postId(newPostId) {
      if (newPostId) {
        this.fetchComments(newPostId);
      }
    }
  },
  created() {
    if (this.postId) {
      this.fetchComments(this.postId);
    }
  },
  methods: {
    async fetchComments(postId) {
      try {
        const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        this.comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      if (!this.newCommentAuthor || !this.newCommentContent) {
        return;
      }

      const comment = {
        author: this.newCommentAuthor,
        content: this.newCommentContent,
        createdAt: new Date().toLocaleString()
      };

      try {
        await addDoc(collection(db, 'posts', this.postId, 'comments'), comment);
        this.comments.push(comment);
        this.newCommentAuthor = '';
        this.newCommentContent = '';
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  }
}
</script>

<style scoped>
.comment {
  background-color: #f8f9fa;
}
.add-comment h4 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}
</style>

