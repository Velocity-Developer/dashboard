<template>
  <Card>
    <template #content>
    

    <div class="flex flex-col md:flex-row gap-3">

      <div class="md:basis-[20%] sm:basis-1/4">
        <Menu :model="items" :pt="{
            root: () => ({
                class: [
                    '!border-none',
                    '!bg-transparent'
                ]
            }),
            item: () => ({
                class: [
                    '!rounded-lg',
                    '!bg-zinc-100 dark:!bg-zinc-800',
                    'mb-1',
                ]
            }),
        }"/>
      </div>
      <div class="md:flex-1">
        <slot />
      </div>

    </div>
    
    </template>
  </Card>
</template>

<script setup lang="ts">
const route = useRoute()
const items = ref([
  {
    label: 'Profile',
    command: () => navigateTo('/dash/users/'+route.params.id) 
  },
  {
    label: 'Avatar',
    command: () => navigateTo('/dash/users/'+route.params.id+'/avatar') 
  },
  {
    label: 'Password',
    command: () => navigateTo('/dash/users/'+route.params.id+'/password') 
  },
]);
</script>
