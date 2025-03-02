<template>
  <div class="inline-flex -space-x-px shadow-sm rounded-m isolate">
    <select id="orderby-dropdown" class="bg-white rounded-l-none ring-[0.5px] ring-gray-300" aria-label="Order by">
      <option value="date">{{ $t('messages.general.latest') }}</option>
      <option value="alphabetically">{{ $t('messages.general.alphabetically') }}</option>
      <option value="price">{{ $t('messages.shop.price') }}</option>
      <option v-if="storeSettings.showReviews" value="rating">{{ $t('messages.shop.rating') }}</option>
      <option value="discount">{{ $t('messages.shop.discount') }}</option>
    </select>
    <button
        class="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-white ring-[1px] ring-gray-300 rounded-l-md hover:bg-gray-50 focus:z-20"
        aria-label="Sort">
      <span class="transition-transform transform transform-origin-center mdi mdi-24px mdi-filter-variant" />
    </button>
  </div>
</template>
<script setup lang="ts">
const { storeSettings } = useAppConfig();
</script>