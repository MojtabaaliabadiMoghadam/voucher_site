<template>
  <div class="container flex items-start gap-16" v-if="dataStore.products">
    <Filters v-if="storeSettings.showFilters" />
    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>Could not fetch products from your store. Please check your configuration.</NoProductsFound>
</template>
<script setup lang="ts">
import Filters from "~/components/filtering/Filters.vue";
import ProductResultCount from "~/components/shopElements/ProductResultCount.vue";
import OrderByDropdown from "~/components/shopElements/OrderByDropdown.vue";
import ShowFilterTrigger from "~/components/filtering/ShowFilterTrigger.vue";
import ProductGrid from "~/components/shopElements/ProductGrid.vue";
import NoProductsFound from "~/components/shopElements/NoProductsFound.vue";
import {useDataGlobal} from "~/stores/globalStore";
const dataStore = useDataGlobal()
dataStore.generateProducts(10)
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

onMounted(() => {
  // setProducts(dataStore.products);
  // if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

