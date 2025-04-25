<template>
  <div class="flex flex-col md:flex-row gap-5">

    <div class="md:basis-[60%] md:min-w-[50%]">
      <img :src="data.original_url" class="mx-auto" :alt="data.file_name" />
    </div>

    <div class="md:flex-1 p-3 md:border-l md:border-gray-200 dark:md:border-zinc-800">

      <div v-for="item in fields" :key="item.key">
        <div class="border-b dark:md:border-zinc-800 py-1">
            <div class="mb-1 font-medium">
              {{ item.label }}
            </div>
            <div class="break-all opacity-80">

              <template v-if="item.key == 'size'">
                {{ data[item.key] }} KB
              </template>
              <template v-else-if="item.key == 'created_at'">
                {{ dayjs(data[item.key]).format('DD MMM YYYY HH:mm') }}
              </template>
              <template v-else>
                {{ data[item.key] }}
              </template>

            </div>
        </div>
      </div>

      <Button @click="confirmDelete(data.id)" severity="danger" size="small" class="w-full my-3">
        <Icon name="lucide:trash-2"/> Delete Media
      </Button>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useDayjs } from '#dayjs'
const dayjs = useDayjs()
const emit = defineEmits(['update'])
const props = defineProps(['data'])
const data = props.data

const fields = [
  { key:'id', label: 'ID'},
  { key:'file_name', label: 'File Name'},
  { key:'size', label: 'Size'},
  { key:'mime_type', label: 'Mime Type'},
  { key:'collection_name', label: 'Collection Name'},
  { key:'original_url', label: 'Original Url'},
  { key:'model_type', label: 'Model Type'},
  { key:'created_at', label: 'Date Created'},
]

const toast = useToast();
const client = useSanctumClient();
const confirm = useConfirm();
const confirmDelete = (id: any) => {    
    confirm.require({
        message: 'Anda yakin media ini?',
        header: 'Delete Media',
        accept: async () => {
            try {              
              const re = await client(`/api/dash/media/${id}`, {
                  method: 'DELETE',
              })
              toast.add({
                severity: 'success',
                summary: 'Berhasil!',
                detail: 'Media berhasil dihapus',
                life: 3000
              });
              emit('update')
            } catch (error) {
                const er = useSanctumError(error)                 
                toast.add({
                    severity: 'error',
                    summary: 'Gagal!',
                    detail: er.msg ? er.msg : 'Terjadi kesalahan saat menghapus data',
                    life: 3000
                });
            }
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Hapus',
            severity: 'danger',
            outlined: false
        },
        reject: () => {
            //callback to execute when user rejects to delete
        }
    });
}
</script>
