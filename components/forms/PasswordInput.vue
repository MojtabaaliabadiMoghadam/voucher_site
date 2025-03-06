<script setup lang="ts">
const showPassword = ref(false);

const { modelValue, className, placeholder, required } = defineProps({
  modelValue: { type: String, required: true },
  className: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const handleInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="relative flex items-center w-full">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="flex items-center flex-1 mt-1 rounded-lg mb-4 w-full font-bold  py-3"
      :value="modelValue"
      @input="handleInputChanged"
      :class="className"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required" />
    <span  class="absolute cursor-pointer left-4 top-3 mdi mdi-24px mdi-eye-outline" @click="showPassword = !showPassword" v-if="showPassword" />
    <Icon  class="absolute cursor-pointer left-4 top-3 mdi mdi-24px mdi-eye-lock-outline" @click="showPassword = !showPassword" v-else />
  </div>
</template>
