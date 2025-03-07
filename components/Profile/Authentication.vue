<template>
  <div class="grid gap-8 account-form">
    <form  class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
      <div class="grid gap-6 p-8 md:grid-cols-2">
        <h3 class="text-xl font-semibold col-span-full">{{ $t('messages.account.title_auth') }}</h3>

        <div class="w-full">
          <label for="first-name">{{ $t('messages.account.mobile') }}</label>
          <input id="first-name" v-model="dataUserStore.dataUser.name" autocomplete="given-name" type="text" />
        </div>
        <div class="w-full">
          <label for="first-name">{{ $t('messages.account.email') }}</label>
          <input id="first-name" v-model="dataUserStore.dataUser.code_melli" autocomplete="given-name" type="text" />
        </div>
        <div class="w-full">
          <label for="first-name">{{ $t('messages.account.id_no') }}</label>
          <input id="first-name" v-model="dataUserStore.dataUser.code_melli" autocomplete="given-name" type="text" />
        </div>
      </div>
      <div class="bg-white backdrop-blur-sm bg-opacity-75 border-t col-span-full p-4 sticky bottom-0 rounded-b-lg">
        <button
            class="rounded-md flex font-semibold ml-auto text-white py-2 px-4 gap-4 items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            :class="button.color"
            :disabled="loading">
          <LoadingIcon v-if="loading" color="#fff" size="20" />
          <span>{{ button.text }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import LoadingIcon from "~/components/generalElements/LoadingIcon.vue";
import {useDataUserStore} from "~/stores/userDataStore";

const { t } = useI18n();

const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('messages.account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });
const dataUserStore= useDataUserStore()

const genders = [
  {name:'messages.account.male',value:'man'},
  {name:'messages.account.female',value:'woman'},
]
</script>
<style>
.account-form input[type='text'],
.account-form input[type='email'],
.account-form input[type='tel'],
.account-form input[type='password'],
.account-form textarea,
.account-form .StripeElement,
.account-form select {
  @apply bg-white border rounded-md outline-none w-full py-2 px-4 block md:bg-gray-50;
}

.account-form label {
  @apply text-xs mb-1 text-gray-600 inline-block uppercase;
}
</style>
