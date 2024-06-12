<template>
  <div class="home">
    <blog-list></blog-list>
  </div>
</template>

<script>
import BlogList from '../components/BlogList.vue';

export default {
  components: {
    BlogList
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>

