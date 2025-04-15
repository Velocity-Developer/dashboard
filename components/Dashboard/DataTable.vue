<template>
  <Card class="md:h-[100%] dark:bg-zinc-800">
    <template #content>
      
      <div>
        <div class="dark:text-zinc-400">Post terbaru</div>
      </div>

      <DataTable v-if="data" :value="data.data" size="small" stripedRows scrollable>
        <Column field="title" header="Title">
          <template #body="slotProps">
            <div @click="openDialog(slotProps.data)" class="flex cursor-pointer">
              <img class="aspect-square object-cover w-8" :src="slotProps.data?.featured_image_url" :alt="slotProps.data?.title" />
              <div class="ms-2 text-xs truncate">
                {{ slotProps.data?.title }}
              </div>
            </div>
          </template>
        </Column>
        <Column field="author" header="Author" class="text-xs">
          <template #body="slotProps">
            {{ slotProps.data?.author?.name }}
          </template>
        </Column>
        <Column field="date" header="Date">
          <template #body="slotProps">
            <span class="text-xs"> {{ slotProps.data?.date }} </span>
          </template>
        </Column>
      </DataTable>

    </template>
  </Card>

  <Dialog v-model:visible="dialog" header="Post" :style="{ width: '40rem', minHeight: '50vh' }" :breakpoints="{ '1000px': '40rem', '768px': '90vw' }" :modal="true">
    <PostPreview :data="selectedItem" />
  </Dialog>

</template>

<script setup lang="ts">
import { PostPreview } from '#components';

const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'dashboard-datatable',
    () => client('/api/dashboard/datatable')
)

const dialog = ref(false);
const selectedItem = ref();
const openDialog = (data: any) => {
    dialog.value = true;
    selectedItem.value = data;   
}
</script>