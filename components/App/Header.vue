<template>
  <header :class="['header', { 'scrolled shadow': isScrolled }]" class="sticky top-0 z-[5] bg-white dark:bg-zinc-900 fixed w-full">

    <nav class="px-2 border-gray-700 rounded-none bg-transparent dark:bg-transparent py-4 sm:px-6">
      <div class="mx-auto flex flex-wrap items-center justify-between">

        <div>
          <Button variant="text" @click="useConfig.toggelOpenSidebar" class="md:hidden">
            <Icon name="lucide:menu" />
          </Button>
          <Button variant="text" @click="useConfig.toggelMiniSidebar" class="hidden md:block">
            <Icon name="lucide:panel-left" />
          </Button>
        </div>
        <div class="flex flex-row justify-end gap-2 items-center">

          <AppHeaderNotif />
          <AppDarkMode />
          <Avatar :image="avatarUrl" @click="toggleAvatar" shape="circle" class="cursor-pointer"/>
          <Menu ref="menuAvatar" id="overlay_avatar_menu" :model="itemsAVatar" :popup="true" />

        </div>

      </div>
    </nav>

  </header>
</template>

<script setup lang="ts">
const useConfig = useConfigStore()
const { user, logout } = useSanctumAuth();
const isScrolled = ref(false);

// Fungsi untuk memeriksa posisi scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50; // Ubah nilai 50 sesuai kebutuhan
};

// Tambahkan event listener saat komponen dimount
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Hapus event listener saat komponen di-unmount
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

//menu avatar
const avatarUrl = computed(() => useConfig.config.user?.avatar_url);
const menuAvatar = ref();
const itemsAVatar = ref([
    {
        label: computed(() => useConfig.config.user.name?useConfig.config.user.name+' Profile':'User Profile'),
        items: [
            {
                label: 'Settings',
                command: () => navigateTo('/users/'+useConfig.config.user.id) 
            },
            {
                label: 'Logout',
                command: () => logout()
            }
        ]
    }
]);
const toggleAvatar = (event: any) => {
  menuAvatar.value.toggle(event);
};
</script>