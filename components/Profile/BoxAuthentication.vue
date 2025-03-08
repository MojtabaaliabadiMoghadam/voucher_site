<template>
  <div class="w-full relative transition-all duration-300 overflow-hidden shadow-xl flex flex-col py-2 bg-gray-100 rounded-xl px-4"
       :class="isExpanded ? 'h-[200px]' : 'h-[80px]'">
    <label for="first-name">{{props.label}}</label>
    <input
        :id="props.id"
        v-model="model"
        autocomplete="given-name"
        type="text"/>
    <div v-if="props.is_valid" class="absolute left-6 top-[33px] flex items-center justify-center bg-green-300 rounded-full h-[30px] w-[30px]">
      <span class="mdi mdi-24px mdi-check text-green-500"/>
    </div>
    <div v-else class="absolute left-6 top-[33px] flex items-center justify-center bg-red-300 rounded-full h-[30px] w-[30px]">
      <span class="mdi mdi-24px mdi-close text-red-500"/>
    </div>
    <div v-if="!is_valid" class="absolute cursor-pointer left-16 top-[33px] flex items-center justify-center bg-green-300 px-3 hover:bg-green-400
             transition-all ease-in duration-150 rounded-md h-[30px]" @click="isExpanded = !isExpanded">
            <span class="text-white">
              {{ $t("messages.account.title_auth") }}
            </span>
    </div>
    <div v-if="isExpanded" class="flex flex-col items-center justify-between pt-5 gap-3">
      <div v-if="props.type === 'otp'" class="flex items-center justify-between w-full gap-3">
        <input
            :id="props.id"
            v-model="otp"
            class="!w-4/6"
            autocomplete="given-name"
            type="text"/>
        <button class="px-3 text-[13px] py-2 bg-gray-400 hover:bg-gray-500 rounded-xl text-white transition-all ease-in duration-300">
          {{props.type === 'otp' ? $t('messages.account.send_otp') : $t('messages.account.send_file')}}
        </button>
      </div>
      <div v-else class="flex items-center justify-between w-full gap-3">
        <div class="flex text-balance leading-tight w-2/4 text-ellipsis overflow-hidden">
          <button @click="UploadImage" class="px-3 text-[13px] py-2 bg-blue-400 hover:bg-blue-500 flex items-center
          w-full justify-center gap-2 rounded-xl text-white transition-all ease-in duration-300">
            {{$t(titleButtonUploadMellicode)}}
            <span class="mdi mdi-upload-box-outline text-[20px]"></span>
          </button>
          <input type="file" ref="fileInput" @change="handleImageUpload" class="hidden" accept="image/*" />
        </div>
        <button class="px-3 text-[13px] w-1/4 py-2 bg-gray-400 hover:bg-gray-500 flex items-center justify-center
        rounded-xl text-white transition-all ease-in duration-300">
          {{$t('messages.account.send_otp')}}
        </button>
      </div>
      <button class="px-3 text-[13px] py-2 bg-blue-400 hover:bg-blue-500 flex items-center w-full md:w-fit justify-center gap-2 rounded-xl text-white transition-all ease-in duration-300">
        {{$t('messages.account.accept')}}
        <span class="mdi mdi-check text-[20px]"></span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const isExpanded = ref(false);
const otp = ref('')
interface IProps {
  label?:string;
  id?:string
  is_valid?:boolean
  type:'otp'|'melli_code'
}
const props = defineProps<IProps>()
const model = defineModel()
const fileInput = ref(null);
const UploadImage = () => {
  fileInput.value.click();
};
const titleButtonUploadMellicode = computed(()=>{
  if (fileMelliCode.value){
    return 'messages.account.file_change'
  }else{
    return 'messages.account.upload_melli_code'
  }
})
const fileMelliCode = ref(null)
const handleImageUpload = async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    fileMelliCode.value = input.files[0]

  }
};
</script>