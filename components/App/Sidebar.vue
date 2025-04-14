<template>
  <nav class="group h-full fixed top-0 start-0 bg-white dark:bg-zinc-800 z-[6] border-r border-border dark:border-gray-600 px-4 transition-all duration-500 ease-in-out" :class="{ 'hover:md:w-[14rem] md:w-[5rem] w-[14rem] hover:shadow': useConfig.miniSidebar, 'w-[14rem]': !useConfig.miniSidebar }">
    
    <div class="py-4 text-center">
      <nuxtLink to="/">
        <img v-if="useConfig.config.app_logo" :src="useConfig.config.app_logo" class="max-h-[50px] w-auto mx-auto" :class="{ 'group-hover:md:block md:hidden block': useConfig.miniSidebar, 'block': !useConfig.miniSidebar }"/>
        <img v-else src="~/public/vd.webp" class="max-h-[50px] w-auto mx-auto" :class="{ 'group-hover:md:block md:hidden block': useConfig.miniSidebar, 'block': !useConfig.miniSidebar }"/>
        
        <img v-if="useConfig.config.app_logo_small" :src="useConfig.config.app_logo_small" class="w-[2rem] mx-auto hidden" :class="{ 'group-hover:md:hidden md:block': useConfig.miniSidebar}"/>
        <img v-else src="~/public/vdi.webp" class="w-[2rem] mx-auto hidden" :class="{ 'group-hover:md:hidden md:block': useConfig.miniSidebar}"/>
      </nuxtLink>
    </div>
    
    <ScrollPanel style="width: 100%; height: calc(100vh - 70px)">
      <PanelMenu
            :model="items"
            class="w-full border-none rounded-none !gap-0"
            :pt="{
                panel: (options) => ({
                    class: [
                        '!border-none',
                        '!bg-transparent',
                        '!pb-0',
                    ]
                }),
                rootList: (options) => ({
                    class: [
                        '!ps-0',
                    ]
                })
            }"
        >
          <template #item="{ item }">

              <button v-if="item.items" v-ripple :class="[classLink,{'bg-emerald-700 text-white dark:text-gray-100' : isActive(item.href),'group-hover:md:!justify-start md:!justify-center': useConfig.miniSidebar}]" @click="useConfig.openSidebar = false">
                  <span class="flex justify-start items-center">
                      <Icon v-if="item.icon" :name="item.icon" :ssr="true"/>
                      <span class="ms-2" :class="{ 'group-hover:md:inline md:hidden': useConfig.miniSidebar}">{{ item.label }}</span>
                  </span>
                  <Icon v-if="item.items" name="lucide:chevron-down" />
              </button>
              <NuxtLink v-else :to="item.href" :class="[classLink,{'bg-emerald-700 text-white dark:text-gray-100' : isActive(item.href),'group-hover:md:!justify-start md:!justify-center': useConfig.miniSidebar}]" @click="useConfig.openSidebar = false">
                  <span class="flex justify-start items-center">
                      <Icon v-if="item.icon" :name="item.icon" :ssr="true"/>
                      <Icon v-else name="lucide:circle-small" size="small" class="opacity-50" :ssr="true"/>
                      <span class="ms-2" :class="{ 'group-hover:md:inline md:hidden': useConfig.miniSidebar}">{{ item.label }}</span>
                  </span>
              </NuxtLink>

          </template>
      </PanelMenu>
    </ScrollPanel>

  </nav>
</template>

<script setup lang="ts">
//route, cek halaman aktif
const route = useRoute()
const isActive = (path : string) => {
  return route.path === path
}

const isChild = (key : any) => {
  return key.includes('_')? true : false
}

//daftar menu
const items = ref([
  {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'lucide:layout-grid',
      href:'/',
  },
  {
      key: 'billing',
      label: 'Billing',
      icon: 'lucide:briefcase-business',
      href:'/billing',
  },
  {
      key: 'users',
      label: 'Users',
      icon: 'lucide:users',
      href:'/users',
  },
  {
      key: 'posts',
      label: 'Posts',
      icon: 'lucide:newspaper',
      items: [
          {
              key: 'posts_all',
              label: 'All Posts',
              href: '/posts',
          },
          {
              key: 'posts_create',
              label: 'Add New Post',
              href: '/posts/create',
          },
          {
              key: 'posts_category',
              label: 'Categories',
              href: '/posts/terms/category',
          },
          {
              key: 'posts_tags',
              label: 'Tags',
              href: '/posts/terms/tag',
          },
      ]
  },
  {
      key: 'settings',
      label: 'Settings',
      icon: 'lucide:settings',
      items: [
          {
              key: 'setting_app',
              label: 'Umum',
              href: '/settings',
          },
          {
              key: 'setting_roles',
              label: 'Roles',
              href: '/settings/roles',
          },
      ]
  },
]);

const classLink = 'w-full mb-0 flex items-center justify-between px-4 py-2 cursor-pointer rounded hover:bg-emerald-200 dark:hover:bg-emerald-900 hover:text-emerald-900 dark:hover:text-emerald-100';

const useConfig = useConfigStore()
const client = useSanctumClient();

onMounted( async () => {
    const getconfig = await client('/api/config');
    useConfig.setConfig(getconfig);
});


</script>