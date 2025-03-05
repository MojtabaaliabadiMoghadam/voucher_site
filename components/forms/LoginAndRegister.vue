<template>
  <div class="max-w-lg mx-auto my-16 min-h-[600px] text-center">
    {{loginStore.loginStatus}}
    <div class="flex flex-col my-2">
      <h1 class="text-xl font-semibold lg:text-3xl">{{formTitle}}</h1>
      <p class="text-gray-500 mt-2">{{formDescription}}</p>
    </div>

    <LoginProviders class="my-8"/>
    <form class="mt-6" @submit.prevent="handleFormSubmit">
      <Transition name="fade" mode="out-in">
        <div v-if="loginStore.loginStatus === 'login'">
          <input dir="ltr" class="mt-1" v-model="inputValue"
                 :placeholder="inputPlaceholder[loginStore.loginWith]"
                 autocomplete="username" type="text" required />
        </div>

        <!-- ورود با OTP -->
        <div v-else-if="loginStore.loginStatus === 'login-otp'">
          <input v-model="otpValue" type="text" class="w-full p-2 border rounded-md" required />
          <a v-if="loginStore.otpTimer > 0" class="mt-2 text-gray-500 cursor-not-allowed" disabled>
            ارسال مجدد در {{ loginStore.otpTimer }} ثانیه
          </a>
          <button v-else @click="loginStore.resendOTP" class="mt-2 text-blue-500">
            ارسال مجدد کد تایید
          </button>
        </div>

        <!-- ورود با رمز عبور -->
        <div v-else-if="loginStore.loginStatus === 'login-password'">
          <PasswordInput v-model="passwordValue" :placeholder="passwordLabel" autocomplete="current-password" required />
        </div>
      </Transition>

      <!-- دکمه ورود -->
      <button class="flex items-center justify-center gap-4 my-6 text-lg h-[32px]" type="submit">
        <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff"/>
        <span v-else>{{ buttonText }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoginStore } from "~/stores/loginStore";
import LoginProviders from "~/components/forms/LoginProviders.vue";
import PasswordInput from "~/components/forms/PasswordInput.vue";
import LoadingIcon from "~/components/generalElements/LoadingIcon.vue";

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();

const message = ref("");
const errorMessage = ref("");
const isPending = ref(false);
const otpValue = ref("");
const passwordValue = ref("");

const handleFormSubmit = async () => {
  isPending.value = true;
  try {
    if (loginStore.loginStatus === "login") {
      console.log('run login')
      await loginStore.RequestForm();
    } else if (loginStore.loginStatus === "login-otp") {
      await loginStore.verifyOTP(otpValue.value);
    } else if (loginStore.loginStatus === "login-password") {
      await loginStore.loginWithPassword(passwordValue.value);
    }
  } catch (error) {
  } finally {
    isPending.value = false;
  }
};

const formTitle = computed(() => {
  switch (loginStore.loginStatus) {
    case "login":
      return "همه‌چیز از اینجا شروع می‌شود";
    case "login-otp":
      return "کد اهراز هویت";
    case "login-password":
      return "رمز عبور خود را وارد کنید";
    default:
      return "ورود به حساب کاربری";
  }
});

const formDescription = computed(() => {
  switch (loginStore.loginStatus) {
    case "login":
      return "برای دسترسی به اطلاعات لطفاً یکی از روش‌های زیر را انتخاب کنید.";
    case "login-otp":
      return "کد ارسال‌شده به موبایل خود را در باکس زیر وارد کنید.";
    case "login-password":
      return "رمز عبور مربوط به حساب خود را وارد نمایید.";
    default:
      return "به حساب خود وارد شوید و از امکانات سایت استفاده کنید.";
  }
});
const inputValue = computed({
  get: () => (loginStore.loginWith === "mobile" ? loginStore.mobile : loginStore.email),
  set: (value) => {
    if (loginStore.loginWith === "mobile") {
      loginStore.mobile = value;
    } else {
      loginStore.email = value;
    }
  },
});

const buttonText = computed(() => {
  if (loginStore.loginStatus === "login") {
    return "بعدی";
  } else if (loginStore.loginStatus === "login-otp") {
    return "تایید کد";
  } else if (loginStore.loginStatus === "login-password") {
    return "ورود";
  }
});

const inputPlaceholder = computed(() => ({
  email: "johndoe@gmail.com",
  mobile: "915 222 22 22",
}));

const passwordLabel = computed(() => "رمز عبور خود را وارد کنید");

watch(() => loginStore.errorMessage, (newError) => {
  if (newError) {
    errorMessage.value = newError;
  }
});
</script>

<style lang="postcss" scoped>
input[type="text"],
input[type="password"],
button {
  @apply border rounded-lg mb-4 w-full bg-white;
}

form button {
  @apply rounded-lg font-bold bg-gray-800 py-3 text-white hover:bg-gray-800;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
