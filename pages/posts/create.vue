<template>
  <div>
    <PostForm action='add' />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Add New Post',
    middleware: ["auth"],
    permission: 'edit-post'
})
</script>
