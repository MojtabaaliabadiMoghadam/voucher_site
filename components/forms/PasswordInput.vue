<template>
  <div class="relative flex items-center w-full border-none">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="flex items-center flex-1 mt-1 rounded-lg mb-4 w-full font-bold  py-3"
      :value="model"
      @input="handleInputChanged"
      :class="className"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required" />
    <span  class="absolute cursor-pointer left-4 top-4 mdi mdi-24px mdi-eye-outline" @click="showPassword = !showPassword" v-if="showPassword" />
    <Icon  class="absolute cursor-pointer left-4 top-4 mdi mdi-24px mdi-eye-lock-outline" @click="showPassword = !showPassword" v-else />
  </div>
</template>
<script setup lang="ts">
const showPassword = ref(false);

const { className, placeholder, required } = defineProps({
  className: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' },
  required: { type: Boolean, default: false },
});
const model = defineModel()
const emit = defineEmits(['update:modelValue']);

const handleInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>