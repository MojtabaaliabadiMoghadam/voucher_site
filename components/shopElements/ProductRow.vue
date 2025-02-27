<template>
  <div v-if="products" class="grid gap-8">
    <ProductCard
      v-for="(node, i) in products"
      :key="node.databaseId"
      class="w-full"
      :node="node"
      :index="i"
      :class="{
        hidden: i === products.length - 1,
        'lg:block': i === products.length - 1,
      }" />
  </div>
</template>
<script setup>
import ProductCard from "~/components/productElements/ProductCard.vue";

const props = defineProps({
  products: { type: Array, default: null },
});
</script>