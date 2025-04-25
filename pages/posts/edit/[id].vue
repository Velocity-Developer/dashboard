<template>
  <div>
    <Button as="router-link" :to="'/posts/create'" class="mb-5" size="small">
      <Icon name="lucide:plus" size="small"/> Add New Post
    </Button>
    <PostForm :id='route.params.id' action='edit' />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Edit Post',
    middleware: ["auth"],
    permission: 'edit-post'
})
const route = useRoute()
</script>
