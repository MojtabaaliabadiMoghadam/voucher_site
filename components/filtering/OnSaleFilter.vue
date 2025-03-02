<template>
  <div>
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center">
      <span>Sale Products Only</span>
      <span class="transform mdi mdi-24px mdi-chevron-down transition-all ease-in duration-150" :class="isOpen ? 'rotate-180' : ''"/>
    </div>
    <div v-if="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
      <div class="flex gap-2 items-center">
        <label for="sale-true" class="cursor-pointer m-0 text-sm sr-only" aria-label="Only show products on sale"> Only show products on sale</label>
        <input id="sale-true" v-model="selectedTerms" type="checkbox" :value="true" aria-label="Sale Products Only" />
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedTerms = ref([]);
const isOpen = ref(true);
</script>
