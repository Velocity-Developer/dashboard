<template>

  <div class="relative overflow-hidden h-screen">    
    <div class="grid grid-cols-12 gap-0 h-screen bg-gradient-to-r from-teal-100 to-sky-200">
      <div class="xl:col-span-8 lg:col-span-7 col-span-12 lg:block hidden relative overflow-hidden">
          <img v-if="bgWelcome" :src="bgWelcome" class="w-full h-full object-cover" alt="welcome" />
      </div>
      <div class="bg-white dark:bg-zinc-900 flex h-screen items-center px-3 justify-center xl:col-span-4 lg:col-span-5 col-span-12 sm:px-12 p-5">

          <slot />
          
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
const useConfig = useConfigStore()
const client = useSanctumClient();

onMounted( async () => {
    const getconfig = await client('/api/dash/config');
    useConfig.setConfig(getconfig);
});

const route = useRoute();
const pageTitle = computed(() => route.meta.title?route.meta.title+' | '+useConfig.config.app_name : useConfig.config.app_name);
const pageDescription = computed(() =>(typeof route.meta.description === 'string') ? route.meta.description : useConfig.config.app_description);
const appFavicon = computed(() => useConfig.config.app_favicon || '');
const bgWelcome = computed(() => useConfig.config.bg_welcome || '');

useHead({
    title: pageTitle,
    meta: [
      {
        name: 'description',
        content: pageDescription
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: appFavicon
      }
    ]
  });
</script>