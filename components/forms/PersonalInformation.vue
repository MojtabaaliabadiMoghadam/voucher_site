<template>
  <form  class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
    <div class="grid gap-6 p-8 md:grid-cols-2">
      <h3 class="text-xl font-semibold col-span-full">{{ $t('messages.account.personalInfo') }}</h3>
      <div class="w-full">
        <label for="first-name">{{ $t('messages.billing.name') }}</label>
        <input id="first-name" v-model="dataUserStore.dataUser.name" autocomplete="given-name" type="text" />
      </div>
      <div class="w-full">
        <label for="first-name">{{ $t('messages.account.melli_code') }}</label>
        <input id="first-name" v-model="dataUserStore.dataUser.code_melli" autocomplete="given-name" type="text" />
      </div>
      <div class="w-full">
        <label class="label-input-style">{{$t('messages.account.gender')}}</label>
        <div style="height: 44px" class="flex items-center gap-3">
          <CartElementsRadioButton v-for="option in genders" v-model="dataUserStore.dataUser.gender"
                       :id="option.value"
                       :value="option.value"
                       :name="option.name"
                       :label="$t(option.name)"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="first-name">{{ $t('messages.account.birth_date') }}</label>
        <CustomDatePicker
            :disabled="true"
            show-default-date
            v-model="bd"
            class="max-w-[11.875rem]"
            :placeholder="$t('availability_rack.select_date')"
            id="date-picker-pricing-rate"
        />
      </div>
<!--      <div class="w-full">-->
<!--        <label for="username">{{ $t('messages.account.username') }} ({{ $t('messages.general.readOnly') }})</label>-->
<!--        <input id="username"   autocomplete="username" type="text" readonly />-->
<!--      </div>-->

<!--      <div class="w-full">-->
<!--        <label for="email">{{ $t('messages.billing.email') }}</label>-->
<!--        <input id="email" v-model="dataUserStore.dataUser.email" autocomplete="email" type="email" />-->
<!--      </div>-->
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
</template>

<script setup lang="ts">
import LoadingIcon from "~/components/generalElements/LoadingIcon.vue";
import {useDataUserStore} from "~/stores/userDataStore";
import CustomDatePicker from "~/components/forms/CustomDatePicker.vue";

const { t } = useI18n();
const bd = ref()
const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('messages.account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });
const dataUserStore= useDataUserStore()

const genders = [
  {name:'messages.account.male',value:'man'},
  {name:'messages.account.female',value:'woman'},
]
</script>
