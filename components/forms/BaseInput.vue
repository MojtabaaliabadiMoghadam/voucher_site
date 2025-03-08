<template>
  <div>
    <label
        :dir="isRtl ?'rtl':'ltr'"
        v-if="props.label || $slots.extra_label"
        :for="props.name"
        class="title-3-700 flex text-asa-text-900	ps-4 mb-1 gap-1 truncate"
        :class="[props.disabled ? 'text-asa-text-500' : 'text-asa-text-800',classLabel,isRtl? '':'max-w-[11.25rem]']"
    >
      <slot name="before_label"/>
      {{ props.label ? $t(props.label) : '' }}
      <slot name="extra_label"/>
    </label>
    <div class="relative">
      <input
          autocomplete="off"
          v-model="model"
          :readonly="props.readonly"
          :type="props.type"
          :name="props.name"
          :id="props.id"
          @blur="emitBlur"
          @input="emitInputChange"
          @change="change"
          :disabled="props.disabled"
          :autocomplete="props.autocomplete"
          :class="[props.class , errorMessage || props.errorMessageFromBackend.length || showError  ? props.classError :  '' ,
           props.classReadOnly ,props.classDisabled ,props.classFocus ,props.classPlaceholder,]"
          class="block w-full   py-3 px-3 rounded-lg label-1-400   bg-white text-asa-text-900 border-0 ring-2 ring-inset ring-asa-transparency-40"
          :placeholder="props.placeholder ?  $t(props.placeholder) : ''"/>
      <div :class="[props.clickable_icon ? 'cursor-pointer' : 'pointer-events-none']" class="absolute inset-y-0 end-0 flex items-center pe-3.5">
        <slot name="icon" />
      </div>
    </div>
    <p v-if="errorMessage && isShowError" class="text-xs font-medium text-red-500 mt-2">
      &nbsp;
      <span>  {{ errorMessage ? $t(errorMessage) : '' }}</span>
    </p>
    <p v-if="props.errorMessageFromBackend.length && !errorMessage && isShowError"
       class="text-xs font-medium text-red-500 mt-2">
      <span> {{ props.errorMessageFromBackend ? $t(props.errorMessageFromBackend) : '' }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import {useField} from "vee-validate";
import * as yup from "yup";

const {isRtl} = useHelpers()
const emit = defineEmits(['emitBlur', 'change', 'inputChange'])

// Define the interface for the component's props
interface PropsInterface {
  type?: string;
  label?: string | null;
  disabled?: boolean;
  icon?: string | null;
  placeholder?: string;
  name?: string;
  id?: string;
  class?: string;
  classReadOnly?: string;
  classDisabled?: string;
  classLabel?: string;
  classError?: string;
  classFocus?: string;
  classPlaceholder?: string;
  rules?: string;
  required?: boolean;
  autocomplete?: string;
  readonly?: boolean;
  isShowError?: boolean;
  showError?: boolean
  errorMessageFromBackend?: string
  clickable_icon?:boolean
}

// Set default values for the props using withDefaults
const props = withDefaults(defineProps<PropsInterface>(), {
  type: 'text',
  label: null,
  disabled: false,
  readonly: false,
  isShowError: true,
  icon: null,
  placeholder: '',
  autocomplete: 'on',
  name: '',
  class: '',
  classReadOnly: 'read-only:bg-asa-transparency-10 read-only:ring-2 read-only:ring-asa-transparency-40 read-only:focus:ring-asa-transparency-40',
  classError: '!bg-asa-red-25 !ring-2 !ring-asa-red-500 !focus:ring-2 !focus:ring-asa-red-500',
  classDisabled: 'disabled:text-asa-text-500  disabled:bg-asa-transparency-10 disabled:ring-transparent disabled:cursor-not-allowed',
  classFocus: 'focus:ring-2 focus:ring-inset focus:ring-asa-brand-60',
  classPlaceholder: 'placeholder:text-asa-text-500 justify-start',
  id: '',
  required: false,
  rules: '',
  errorMessageFromBackend: '',
  showError: false,
  clickable_icon:false
});
let debounceTimer: any;

function emitInputChange(event) {
  // Convert Persian numbers to English numbers
  const convertedValue = convertPersianToEnglish(event.target.value);
  if (props.class.includes('money')) {
    const cleanedValue = convertedValue.replace(/,/g, '');
    if (cleanedValue === '') {
      event.target.value = '';
      model.value = '';
    } else {
      event.target.value = Number.parseFloat(cleanedValue);
      model.value = Number.parseFloat(cleanedValue);
    }
  } else {
    event.target.value = convertedValue;
    model.value = convertedValue;
  }

  // Clear any existing debounce timer
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    emit('inputChange', event.target.value)
  }, 900); // Adjust debounce delay as needed
}

function emitBlur(event: Event) {
  emit('emitBlur')
  handleBlur(event)
}

function change(e: Event) {
  emit('change', e.target?.value)
  handleChange(e.target?.value)
}

const model = defineModel()

const validatePassword = yup
    .string()
    .required(`${props.label || props.name} is required`);
const {errorMessage, value, handleBlur, handleChange} = useField(
    ref(props.name),
    props.rules == "required" ? validatePassword : props.rules,
    {
      initialValue: model.value,
      label: props.label || props.name,
    }
);
// const setInValidClass = computed(()=>{
//   if (props.errorMessageFromBackend || errorMessage){
//
//   }
// })

// Function to convert Persian numbers to English numbers
function convertPersianToEnglish(input) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return input.replace(/[۰-۹]/g, (char) => englishNumbers[persianNumbers.indexOf(char)]);
}

const applyMask = () => {
  if (props.id && props.class.includes('money')) {
    // بررسی اینکه jQuery و پلاگین mask بارگذاری شده‌اند
    if (typeof $ !== 'undefined' && $.fn.mask) {
      // یافتن تمام input های با کلاس money
      document.querySelectorAll('.money').forEach((input: HTMLElement) => {
        // اعمال ماسک بر روی هر input به صورت جداگانه
        $(input).mask('000,000,000,000,000,000,000,000,000,000,000', {reverse: true});
      });
    } else {
      console.error('jQuery or jQuery Mask Plugin is not loaded.');
    }
  }
};

// اطمینان از اجرای ماسک بعد از بارگذاری کامل DOM
onMounted(() => {
  nextTick(() => {
    applyMask();
  });
});


</script>

<style lang="scss" scoped>

</style>
