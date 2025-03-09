<template>
  <div class="grid gap-8 account-form">
    <form class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
      <div class="grid gap-6 p-8 md:grid-cols-2">
        <h3 class="text-xl font-semibold col-span-full">{{ $t('messages.account.title_auth') }}</h3>
        <template v-for="(value, key) in listOFAuth">
          <BoxAuthentication
              v-if="key === 'email' || key === 'mobile'"
              :is_valid="value?.is_verified"
              :key_custom="key"
              :label="$t(getTitle(key))"
              v-model="dataUserStore.dataUser.mobile"
          />
          <BoxAuthwithFile
              v-else
              :type="key"
              :label="$t(getTitle(key))"
              v-model="dataUserStore.dataUser[key]"
              :result="value?.result"
              @fetch-again="getListAuth"
          />
        </template>
      </div>
      <div class="bg-white backdrop-blur-sm bg-opacity-75 border-t col-span-full p-4 sticky bottom-0 rounded-b-lg">
        <button
            class="rounded-md flex font-semibold ml-auto text-white py-2 px-4 gap-4 items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            :class="button.color"
            :disabled="loading">
          <LoadingIcon v-if="loading" color="#fff" size="20"/>
          <span>{{ button.text }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import LoadingIcon from "~/components/generalElements/LoadingIcon.vue";
import {useDataUserStore} from "~/stores/userDataStore";
import BoxAuthentication from "~/components/Profile/BoxAuthentication.vue";
import DateConverter from "~/helpers/DateConverter";
import {as} from "@faker-js/faker/dist/airline-BcEu2nRk";
import {awaitExpression} from "@babel/types";
import BoxAuthwithFile from "~/components/Profile/BoxAuthwithFile.vue";
const {getUrl, fetchData, showSuccessToast, showErrorToast,objectOrArrayIsNotEmpty} = useHelpers()
const {t} = useI18n();
const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({
  text: t('messages.account.updateDetails'),
  color: 'bg-primary hover:bg-primary-dark'
});
const getTitle = (type: string): string => {
  const titles: Record<string, string> = {
    mobile: "messages.account.mobile",
    email: "messages.account.email",
    passport: "messages.account.passport",
    id_card: "messages.account.id_no",
  };

  return titles[type] || "نامشخص";
};

const prepareKey = (type: string): string => {
  const titles: Record<string, string> = {
    mobile: "mobile",
    email: "email",
    passport: "karte_melli",
    id_card: "id_card",
  };

  return titles[type] ;
};

const dataUserStore = useDataUserStore()
const listOFAuth = ref({})
async function getListAuth(){
  let url = getUrl('web/authentication')
  try {
    const {status,message,data} = await fetchData({
      url,
      method:'GET',
      authorization:true
    })
    if (status == 200){
      listOFAuth.value = data
    }else{
      showErrorToast(message)
    }
  }catch (error){

  }finally {
  }
}
onMounted(async ()=>{
  await getListAuth()
})
</script>
<style scoped>
</style>
