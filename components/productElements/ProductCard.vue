<template>
  <div class="relative group">
    <NuxtLink v-if="node.slug" :to="`/product/${decodeURIComponent(node.slug)}`" :title="node.name">
      <SaleBadge :node class="absolute top-2 right-2" />
      <NuxtImg
          v-if="mainImage"
          :width="imgWidth"
          :height="imgHeight"
          :src="node?.image?.url"
          :alt="node.image?.altText || node.name || 'Product image'"
          :title="node.title"
          :loading="index <= 3 ? 'eager' : 'lazy'"
          :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
          class="rounded-lg object-top object-cover w-full aspect-9/8 md:h-[280px] h-[150px]"
          placeholder
          placeholder-class="blur-xl" />
    </NuxtLink>
    <div class="p-2">
      <StarRating v-if="storeSettings.showReviews" :rating="3" :count="3" />
      <NuxtLink v-if="node.slug" :to="`/product/${decodeURIComponent(node.slug)}`" :title="node.name">
        <h2 class="mb-2 font-light leading-tight group-hover:text-primary">{{ node.title }}</h2>
      </NuxtLink>
      <ProductPrice class="text-sm" :sale-price="'5$'" :regular-price="node.price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SaleBadge from "~/components/productElements/SaleBadge.vue";
import StarRating from "~/components/productElements/StarRating.vue";
import ProductPrice from "~/components/productElements/ProductPrice.vue";

const route = useRoute();
const { storeSettings } = useAppConfig();
const props = defineProps({
  node: { type: Object , required: true },
  index: { type: Number, default: 1 },
});

const imgWidth = 280;
const imgHeight = Math.round(imgWidth * 1.125);

// example: ?filter=pa_color[green,blue],pa_size[large]
const filterQuery = ref(route.query?.filter as string);
const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

// watch filterQuery
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter as string;
    paColor.value = filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || [];
  },
);

const mainImage = computed<string>(() => props.node?.src  || '/images/placeholder.jpg');
</script>
