<template>
  <Badge :severity="status == 'published' ? 'success' : 'contrast'" size="small" class="capitalize">
    {{ status }}
  </Badge>
</template>

<script setup lang="ts">
const props = defineProps(['status'])
const status = props.status
</script>
