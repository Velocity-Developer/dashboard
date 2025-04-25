<template>

  <div class="flex w-full min-h-screen">

    <div class="page-wrapper flex w-full transition duration-300 ease-in-out" :class="{'md:ps-[5rem]': useConfig.miniSidebar,'md:ps-[14rem]': !useConfig.miniSidebar }">
      <div class="xl:block" :class="{ 'block z-[90]': useConfig.openSidebar, 'hidden md:block': !useConfig.openSidebar }">
        <div class="flex">
          <DashSidebar :toggleMini="minim"/>
        </div>
      </div>
      <div class="body-wrapper w-full bg-white dark:bg-zinc-900">
        <DashHeader @toggleMini="toggleMini"/>
        <div class="container mx-auto p-6">

          <div v-if="$route.meta.title" class="bg-primary-50 dark:bg-zinc-800 p-3 md:p-5 rounded-lg mb-3 md:mb-5">
            <h1 class="text-lg md:text-2xl font-medium text-zinc-700 dark:text-primary-400 capitalize">
                {{ $route.meta.title }}
            </h1>
            <div v-if="$route.meta.description" class="text-sm text-zinc-400">
              {{ $route.meta.description }}
            </div>
          </div>

          <slot />

        </div>
      </div>

      <div 
      @click="useConfig.openSidebar = false" 
      class="fixed top-0 end-0 start-0 bottom-0 bg-black opacity-50 z-[80] md:hidden" 
      :class="{ 'hidden': !useConfig.openSidebar }"></div>

    </div>

  </div>

</template>

<script setup lang="ts">
  const useConfig = useConfigStore()

  const minim = ref(false)
  function toggleMini() {
    minim.value = !minim.value
  }

  const route = useRoute();
  const pageTitle = computed(() => route.meta.title?route.meta.title+' | '+useConfig.config.app_name : useConfig.config.app_name);
  const pageDescription = computed(() =>(typeof route.meta.description === 'string') ? route.meta.description : useConfig.config.app_description);
  const appFavicon = computed(() => useConfig.config.app_favicon || '');

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
