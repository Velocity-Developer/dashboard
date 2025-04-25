<template>
  <div class="w-full h-[60vh] flex items-center justify-center">
        
    <div class="text-center">
      <div>
        <Icon name="lucide:octagon-x" size="3rem" class="text-red-500"/>
      </div>
      <div class="text-5xl font-bold">403</div>
      <div class="text-2xl font-bold">Forbidden</div>
      <div class="md:text-lg mt-3">Anda tidak memiliki ijin akses ke halaman ini.</div>
      <div class="md:text-lg">Silahkan kembali ke halaman sebelumnya.</div>
      <div class="mt-5">
        <Button @click="$router.back()" size="small" severity="contrast">
          <Icon name="lucide:arrow-left" size="small"/> Kembali
        </Button>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>