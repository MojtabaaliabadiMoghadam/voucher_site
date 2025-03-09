<template>
  <main class="container relative py-6 xl:max-w-7xl">
    {{slug}}
    <div v-if="dataStore.products.length">
      <SEOHead :info="dataStore.products[0]"/>
      <Breadcrumb :product class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <img class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />

        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold">
                {{ product }}
<!--                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>-->
              </h1>
<!--              <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" v-if="storeSettings.showReviews" />-->
            </div>
<!--            <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />-->
          </div>

          <div class="grid gap-2 my-8 text-sm empty:hidden">
            <div v-if="!isExternalProduct" class="flex items-center gap-2">
              <span class="text-gray-400">{{ $t('messages.shop.availability') }}: </span>
              <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
            </div>
            <div class="flex items-center gap-2" v-if="storeSettings.showSKU && product.sku">
              <span class="text-gray-400">{{ $t('messages.shop.sku') }}: </span>
              <span>{{ product.sku || 'N/A' }}</span>
            </div>
          </div>

          <div class="mb-8 font-light prose" v-html="product.shortDescription || product.description" />

          <hr />

          <form @submit.prevent="addToCart(selectProductInput)">
            <AttributeSelections
                v-if="isVariableProduct && product.attributes && product.variations"
                class="mt-4 mb-8"
                :attributes="product.attributes.nodes"
                :defaultAttributes="product.defaultAttributes"
                :variations="product.variations.nodes"
                @attrs-changed="updateSelectedVariations" />
            <div
                v-if="isVariableProduct || isSimpleProduct"
                class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 bg-white md:static md:bg-transparent bg-opacity-90 md:p-0">
              <input
                  v-model="quantity"
                  type="number"
                  min="1"
                  aria-label="Quantity"
                  class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
              <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
            </div>
            <a
                v-if="isExternalProduct && product.externalUrl"
                :href="product.externalUrl"
                target="_blank"
                class="rounded-lg flex font-bold bg-gray-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none">
              {{ product?.buttonText || 'View product' }}
            </a>
          </form>

          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories">
            <div class="grid gap-2 my-8 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-gray-400">{{ $t('messages.shop.category', 2) }}:</span>
                <div class="product-categories">
                  <NuxtLink
                      v-for="category in product.productCategories.nodes"
                      :key="category.databaseId"
                      :to="`/product-category/${decodeURIComponent(category?.slug || '')}`"
                      class="hover:text-primary"
                      :title="category.name"
                  >{{ category.name }}<span class="comma">, </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <hr />
          </div>

          <div class="flex flex-wrap gap-4">
            <WishlistButton :product />
            <ShareButton :product />
          </div>
        </div>
      </div>
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product />
      </div>
      <div class="my-32" v-if="product.related && storeSettings.showRelatedProducts">
        <div class="mb-4 text-xl font-semibold">{{ $t('messages.shop.youMayLike') }}</div>
        <ProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import SEOHead from "@/components/generalElements/SEOHead.vue";
import ProductImageGallery from "@/components/productElements/ProductImageGallery.vue";
import StarRating from "@/components/productElements/StarRating.vue";
import ProductPrice from "@/components/productElements/ProductPrice.vue";
import AttributeSelections from "@/components/productElements/AttributeSelections.vue";
import AddToCartButton from "@/components/productElements/AddToCartButton.vue";
import WishlistButton from "@/components/productElements/WishlistButton.vue";
import ShareButton from "@/components/productElements/ShareButton.vue";
import ProductTabs from "@/components/productElements/ProductTabs.vue";
import ProductRow from "@/components/shopElements/ProductRow.vue";
import {useDataGlobal} from "~/stores/globalStore";
const {locale} = useI18n()
const route = useRoute();
const { storeSettings } = useAppConfig();
const { t } = useI18n();
const slug = route.params.slug as string;
const dataStore = useDataGlobal()
const product = ref()
const data = ref();
if (!dataStore?.products) {
  throw showError({ statusCode: 404, statusMessage: t('messages.shop.productNotFound') });
}
onMounted(async ()=>{
  await dataStore.GetProducts()
  product.value = dataStore.products[0]
})
</script>
<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>
