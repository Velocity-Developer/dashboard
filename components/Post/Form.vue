<template>
  
  <form @submit.prevent="handleSubmit">

    <div class="flex flex-col md:flex-row gap-5 md:gap-8">

      <div class="md:flex-1">

        <div class="mb-5">
          <label class="mb-1 block text-sm" for="title">Post Title</label>
          <InputText id="title" type="text" v-model="form.title" class="w-full" placeholder="Post Title" required/>

          <div v-if="form.slug">
            <Message size="small" severity="info" class="mt-1 mb-4">
              <Icon name="lucide:info" size="small"/>
              Slug : {{ form.slug }}
            </Message>
          </div>

        </div>
        
        <div class="mb-5">
          <label class="mb-1 block text-sm" for="content">Post Content</label>
          <div class="flex justify-end mb-1">
              <SelectButton v-model="editor" size="small" :options="[{label:'Visual',value:'visual'},{label:'Html',value:'html'}]" optionLabel="label" optionValue="value" />
          </div>

          
          <Editor v-if="editor == 'visual'" v-model="form.content" id="content" editorStyle="height: 60vh;font-size: 16px" />
          <!-- <Textarea v-else id="content" v-model="form.content" class="w-full" rows="20" placeholder="Post Content" required>
            {{ replaceNbsps(form.content) }}
          </Textarea> -->
          <textarea v-else id="content" v-model="form.content" class="w-full border rounded-lg p-4 text-amber-300 bg-stone-800 code-editor" rows="20" placeholder="Post Content">
            {{ replaceNbsps(form.content) }}
          </textarea>
        </div>
        
        <div class="mb-5 border dark:border-zinc-800 p-4 rounded-lg">
          <div class="mb-3">
            <div class="mb-1 opacity-75 text-sm">
              Categories
            </div>
            <MultiSelect v-model="form.category" :options="OptionCategory.data" optionValue="id" optionLabel="name" filter placeholder="Select Categories"
              :maxSelectedLabels="200" class="w-full" />
          </div>
            <div class="mb-1 opacity-75 text-sm">
              Tags
            </div>
            <Textarea v-model="form.tags" class="w-full" rows="5" placeholder="Post Tags"></Textarea>
            <p class="text-sm text-zinc-400">Use comma (,) to separate tags</p>
        </div>
        
      </div>
      <div class="md:basis-[15rem]">
        
        <div class="mb-5 border dark:border-zinc-800 p-4 rounded-lg">
          <div class="mb-3">
            <label class="mb-1 block text-sm" for="status">Post Status</label>
            <SelectButton v-model="form.status" id="status" class="w-full" size="small" :options="[{label:'Publish',value:'published'},{label:'Draft',value:'draft'}]" optionLabel="label" optionValue="value" />
          </div>
        
          <div class="mb-3">
            <label class="mb-1 block text-sm" for="date">Post Date</label>
            <DatePicker id="date" v-model="form.date" showTime hourFormat="24" class="w-full" fluid />
          </div>

          <div class="text-end">
            <Button type="submit" class="w-full" :loading="isLoading">
              <span v-if="isLoading" class="flex items-center gap-1">
                <Icon name="lucide:loader-circle" mode="svg" class="mr-1 animate-spin" /> Proccess..
              </span>
              <span v-else class="flex items-center gap-1">
                <Icon name="lucide:save" mode="svg" class="mr-1" /> Save
              </span>
            </Button>
          </div>

        </div>

        <div class="mb-5 border dark:border-zinc-800 p-4 rounded-lg">
          <div class="mb-1 opacity-75 text-sm">
            Featured Image
          </div>
          <img v-if="srcImage" :src="srcImage" alt="Image" class="w-full object-cover aspect-square rounded-lg mb-1"/>
          <FileUpload mode="basic" @select="onImageSelect" customUpload auto severity="secondary" class="p-button-outlined" />
        </div>
                
        <div v-if="authorData" class="mt-5 border dark:border-zinc-800 p-4 rounded-lg flex items-center">
          <Avatar :image="authorData.avatar_url" size="large" shape="circle" class="mr-2" />
          {{ authorData.name }}
        </div>

      </div>

    </div>
    
  </form>

</template>

<script setup lang="ts">
import { useDayjs } from '#dayjs'
const dayjs = useDayjs()
const props = defineProps(['id','action'])
const id = props.id
const action = props.action
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();
const errors = ref('' as any)
const editor = ref('visual');
const authorData = ref('' as any)

const form = reactive({
  title : '',
  content: 'Hello World!',
  slug: '',
  status: 'published',
  date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  featured_image: '',
  category: [],
  tags: '',
} as any)

onMounted( async () => {
  if(action == 'edit'){
    try {
      const res = await client('/api/posts/'+id)
      Object.assign(form, res)

      if(res.featured_image){
        srcImage.value = res.featured_image_url
      }

      if(res.author_data){
        authorData.value = res.author_data
      }

      if(res.category){
        //ambil id category
        form.category = res.category.map((item: any) => item.id)
      }

      if(res.tags){
        //ambil name tags, jadikan string
        form.tags = res.tags.map((item: any) => item.name).join(',')        
      }

    } catch (error) {
      const er = useSanctumError(error)
    }
  }
})

const srcImage = ref(null);
const newImage = ref('' as any);
function onImageSelect(event : any) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      srcImage.value = e.target.result;
    };

    reader.readAsDataURL(file);
    newImage.value = event.files[0]
}

//watch form.date
watch(() => form.date, () => {
  //ubah format date dayjs
  form.new_date = dayjs(form.date).format('YYYY-MM-DD HH:mm:ss')
})

const { data: OptionCategory, refresh: refreshOptionCategory } = await useAsyncData(
    'options-category',
    () => client('/api/terms',{
        params: {
            page: 1,
            taxonomy: 'category',
            count: 200
        }
    })
)

const handleSubmit = async () => {
    isLoading.value = true
    errors.value = ''  
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('status', form.status);
    formData.append('date', form.date);
    formData.append('featured_image', newImage.value);
    formData.append('category', form.category);
    formData.append('tags', form.tags);

    if(form.new_date){
      formData.append('date', form.new_date);
    }

    if(action == 'add'){
      try {          
        const response = await client('/api/posts', {
          method: 'POST',
          body: formData
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Data Post berhasil ditambah',
          life: 3000
        });
        isLoading.value = false

        //navigate to
        navigateTo('/posts/edit/'+response.id) 

      } catch (error) {
        const er = useSanctumError(error)  
        errors.value = er.bag
        console.log(errors) 
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat menambahkan data',  
            life: 3000
        });
      }
    } else if(action == 'edit') {
      try {          
        const response = await client('/api/posts/'+id, {
          method: 'PUT',
          body: formData
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Data Post berhasil disimpan',
          life: 3000
        });
        isLoading.value = false

        //update form
        form.slug = response.slug

      } catch (error) {
        const er = useSanctumError(error)  
        errors.value = er.bag
        console.log(errors) 
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat simpan data',
            life: 3000
        });
      }
    }
    isLoading.value = false
}

function replaceNbsps(str: any) {
  return str.replace(/&nbsp;/g, " ");
}
</script>

<style scoped>
.code-editor {
  font-family: 'Fira Code', sans-serif;
  font-size: 13px;
}
</style>