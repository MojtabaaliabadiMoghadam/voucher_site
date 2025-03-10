<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <div v-if="product">
<!--      <SEOHead :info="product" />-->
      <Breadcrumb :product class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <img class="relative flex-1 skeleton" :src="product.image || '/images/placeholder.jpg'" :alt="product.name" />

        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <h1 v-if="product?.slug?.length" class="mb-2 text-2xl font-semibold">{{ product.translations[locale].title }}</h1>
          <p v-if="product?.slug?.length" class="mb-4 text-gray-500">{{ product.translations[locale].description }}</p>
          <p class="text-xl font-bold">{{ product.price }} تومان</p>

          <div class="mt-4 w-full flex gap-3">
            <Button @click="dataStore.CreateOrder" class="w-3/4 " label="افزودن به سبد خرید" severity="contrast" raised />
            <input v-model="dataStore.quantity" data-v-476608ae="" type="number" min="1" aria-label="Quantity"
                   class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import SEOHead from '@/components/generalElements/SEOHead.vue';
import Breadcrumb from '@/components/generalElements/Breadcrumb.vue';
import {useDataGlobal} from "~/stores/globalStore";
const dataStore = useDataGlobal()
const storeSettings = ref({ showBreadcrumbOnSingleProduct: true });
const {locale} = useI18n()

const product = ref({})
onMounted(async ()=>{
  await dataStore.GetProducts()
  product.value = dataStore?.products[0]
})
</script>

<style scoped>
.skeleton {
  background-color: #f3f3f3;
  border-radius: 8px;
}
</style>