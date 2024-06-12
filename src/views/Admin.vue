<template>
  <div class="admin container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Admin Dashboard</h1>
      <button @click="logout" class="btn btn-secondary">Logout</button>
    </div>
    <div class="card shadow-sm p-4">
      <h2>Create Post</h2>
      <form @submit.prevent="createPost">
        <div class="form-group">
          <label for="title">Title</label>
          <input v-model="title" type="text" id="title" class="form-control mb-3" required />
        </div>
        <div class="form-group">
          <label for="excerpt">Excerpt</label>
          <input v-model="excerpt" type="text" id="excerpt" class="form-control mb-3" required />
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <div id="contentEditor" class="form-control mb-3" contenteditable="true" @input="updateContent"></div>
        </div>
        <div class="form-group">
          <label for="image">Upload Image</label>
          <input type="file" id="image" class="form-control-file mb-3" @change="onFileChange">
        </div>
        <div class="form-group">
          <label for="authorId">Author ID</label>
          <input v-model="authorId" type="text" id="authorId" class="form-control mb-3" required />
        </div>
        <div class="form-group">
          <label for="categoryId">Category ID</label>
          <input v-model="categoryId" type="text" id="categoryId" class="form-control mb-3" required />
        </div>
        <div class="form-group">
          <label for="tagIds">Tag IDs (comma separated)</label>
          <input v-model="tagIds" type="text" id="tagIds" class="form-control mb-3" required />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>
<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../main';

export default {
  data() {
    return {
      title: '',
      excerpt: '',
      content: '',
      authorId: '',
      categoryId: '',
      tagIds: '',
      image: null,
      imageUrl: ''
    };
  },
  methods: {
    async createPost() {
      // Upload the image if present
      if (this.image) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${this.image.name}`);
        await uploadBytes(storageRef, this.image);
        this.imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        title: this.title,
        excerpt: this.excerpt,
        content: this.content,
        imageUrl: this.imageUrl,
        authorId: this.authorId,
        categoryId: this.categoryId,
        tagIds: this.tagIds.split(',').map(tagId => tagId.trim()),
        createdAt: new Date()
      });

      this.resetForm();
    },
    updateContent() {
      this.content = document.getElementById('contentEditor').innerHTML;
    },
    onFileChange(event) {
      this.image = event.target.files[0];
    },
    resetForm() {
      this.title = '';
      this.excerpt = '';
      this.content = '';
      this.authorId = '';
      this.categoryId = '';
      this.tagIds = '';
      this.image = null;
      this.imageUrl = '';
      document.getElementById('contentEditor').innerHTML = '';
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$router.push('/login');
      });
    }
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (!user) {
        this.$router.push('/login');
      }
    });
  }
}
</script>
<style scoped>
.admin {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}
.card {
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
h1, h2 {
  font-weight: 600;
}
#contentEditor {
  min-height: 200px;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
#contentEditor:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 5px rgba(128, 189, 255, 0.5);
}
</style>

