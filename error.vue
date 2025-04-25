<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="w-full h-screen bg-amber-50 dark:bg-zinc-900 flex flex-col justify-center items-center">
    
    <h1 v-if="error" class="text-3xl md:text-9xl font-extrabold text-red-500 mb-4">{{ error.statusCode }}</h1>

    <div v-if="error" class="mb-4">
      {{ error.message }}
    </div>

    <NuxtLink to="/" class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">Go back home</NuxtLink>
  </div>
</template>
