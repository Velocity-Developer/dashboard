<template>
  <div>

    <div class="text-xl font-bold mb-3">
      {{ data.title }}
    </div>
    <div class="text-sm mb-5">
      <span>
        {{ data.author_data.name }}
      </span>
      <span> | </span>
      <span>
        {{ data.date }}
      </span>
      <span> | </span>
      <span>
        <span v-for="category in data.category" :key="data.category" class="me-1">
          {{ category.name }},
        </span>
      </span>
    </div>
    <img :src="data.featured_image_url" class="w-full mb-2" :alt="data.title" />

    <div v-if="data.content" v-html="data.content" class="w-full break-all"></div>

    <div v-if="data.tags">
        <Badge severity="secondary" v-for="tag in data.tags" :key="data.tags" class="me-1 mb-1">
          {{ tag.name }}
        </Badge>
    </div>
    
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['data'])
const data = props.data
</script>