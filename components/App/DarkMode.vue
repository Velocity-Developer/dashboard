<template>
  <div>
    <Button @click="toggleDarkMode" variant="text" severity="contrast" class="!px-2">
      <Icon v-if="dark" name="lucide:sun" class="text-amber-400"/>
      <Icon v-else name="lucide:moon" class="text-zinc-700"/>
    </Button>
  </div>
</template>

<script setup lang="ts">
const dark = ref(false);

// Function to toggle dark mode
function toggleDarkMode() {
  dark.value = !dark.value;
  document.documentElement.classList.toggle('dark', dark.value);
  localStorage.setItem('darkMode', dark.value ? 'true' : 'false');
}

// Ensure dark mode preference is applied on reload
onMounted(() => {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference === 'true') {
    dark.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>