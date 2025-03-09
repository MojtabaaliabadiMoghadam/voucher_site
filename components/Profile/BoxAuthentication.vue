<template>
  <div class="w-full relative transition-all duration-300 overflow-hidden flex gap-3 flex-col py-2 bg-gray-100 rounded-xl px-4"
       :class="isExpanded ? 'h-[300px]' : 'h-[120px]'">
    <label for="first-name">{{props.label}}</label>
    <input
        :id="props.id"
        v-model="model"
        class="border-none focus:ring-0 rounded-xl py-3"
        autocomplete="given-name"
        type="text"/>
    <div v-if="props.is_valid" class="absolute left-6 top-[52px] flex items-center justify-center bg-green-500 rounded-full h-[30px] w-[30px]">
      <span class="mdi mdi-24px mdi-check text-white"/>
    </div>
    <div v-else class="absolute left-6 top-[52px] flex items-center justify-center bg-red-500 rounded-full h-[30px] w-[30px]">
      <span class="mdi mdi-24px mdi-close text-white"/>
    </div>
    <div v-if="!is_valid" class="absolute cursor-pointer left-16 top-[52px] flex items-center justify-center bg-[#020617] px-3
             transition-all ease-in duration-150 rounded-md h-[30px] select-none" @click="isExpanded = !isExpanded">
            <span class="text-white">
              {{ $t("messages.account.title_auth") }}
            </span>
    </div>
    <div v-if="isExpanded" class="flex flex-col h-full items-center justify-between pt-5 gap-3">
      <div class="flex flex-col md:flex-row items-center justify-between w-full gap-3">
        <InputNumber class="md:!w-4/6" v-model="otp" inputId="withoutgrouping" :useGrouping="false" fluid />
        <div class="w-full md:w-fit flex justify-center">
          <Button icon="mdi mdi-send-variant-outline" class="w-full"
                  :label="$t('messages.account.send_otp')" severity="contrast" />
        </div>
      </div>
      <div class="w-full md:w-fit flex justify-center">
        <Button class="w-full" icon="mdi mdi-check" :label="$t('messages.account.confirm')" severity="info" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const {getUrl, fetchData, showSuccessToast, showErrorToast,objectOrArrayIsNotEmpty} = useHelpers()
import Button from 'primevue/button';

import InputNumber from 'primevue/inputnumber';
import {useDataUserStore} from "~/stores/userDataStore";
const dataUserStore = useDataUserStore()
const isExpanded = ref(false);
const otp = ref('')
const emit = defineEmits(['fetch-again'])
interface IProps {
  label?:string;
  key_custom?:string;
  id?:string;
  is_valid?:boolean
}
const props = defineProps<IProps>()
const model = defineModel()



</script>