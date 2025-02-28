<template>
  <Transition name="fade" mode="out-in">
    <section v-if="!!dataStore.products?.length" class="relative w-full">
      <TransitionGroup name="shrink" tag="div" mode="in-out" class="product-grid">
        <ProductCard v-for="(node, i) in dataStore.products" :key="node.id || i" :node :index="i" />
      </TransitionGroup>
      <Pagination />
    </section>
    <NoProductsFound v-else />
  </Transition>
</template>
<script setup lang="ts">
import ProductCard from "~/components/productElements/ProductCard.vue";
import Pagination from "~/components/shopElements/Pagination.vue";
import NoProductsFound from "~/components/shopElements/NoProductsFound.vue";
import {useDataGlobal} from "~/stores/globalStore";
const dataStore = useDataGlobal()

const route = useRoute();
const { productsPerPage } = useHelpers();
// const { products } = useProducts();
const page = ref(parseInt(route.params.pageNumber as string) || 1);
// const productsToShow = computed(() => products.value.slice((page.value - 1) * productsPerPage, page.value * productsPerPage));
</script>
<style lang="postcss" scoped>
.product-grid {
  @apply my-4 min-h-[600px] grid transition-all gap-8 lg:my-8;

  grid-template-columns: repeat(2, 1fr);
}
.product-grid:empty {
  display: none;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}

.shrink-move {
  transition: all 400ms;
}

.shrink-leave-active {
  transition: transform 300ms;
  position: absolute;
  opacity: 0;
}

.shrink-enter-active {
  transition:
    opacity 400ms ease-out 200ms,
    transform 400ms ease-out;
  will-change: opacity, transform;
}

.shrink-enter,
.shrink-leave-to,
.shrink-enter-from {
  opacity: 0;
  transform: scale(0.75) translateY(25%);
}
</style>
