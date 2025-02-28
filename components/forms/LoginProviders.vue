<script setup lang="ts">
// حذف وابستگی‌ها به API
const route = useRoute();
const router = useRouter();

// شبیه‌سازی داده‌های تستی برای نمایش المان‌ها
const socialLoginsDisplay = 'buttons';
const socialLoginProviders = ref([
  { provider: 'GOOGLE', authorizationUrl: '/auth/google', name: 'Login with Google' },
  { provider: 'GITHUB', authorizationUrl: '/auth/github', name: 'Login with GitHub' }
]);

const providerIcons = {
  FACEBOOK: 'ion:logo-facebook',
  GITHUB: 'ion:logo-github',
  GOOGLE: 'ion:logo-google',
};
</script>

<template>
  <div v-if="socialLoginProviders?.length">
    <div
        class="gap-4"
        :class="
        socialLoginsDisplay === 'buttons' ? 'grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] justify-center' : ' flex gap-4 flex-wrap justify-center'
      ">
      <div v-for="(loginClient, index) in socialLoginProviders" :key="index">
        <NuxtLink
            :to="loginClient.authorizationUrl"
            class="flex items-center justify-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow transition duration-100 ease-in-out">
          <span v-if="loginClient.provider" :class="[providerIcons[loginClient.provider as keyof typeof providerIcons]]" size="20" />
          <Icon v-else name="ion:log-in" size="20" />
          <span v-if="socialLoginsDisplay === 'buttons'">{{ loginClient.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- or continue with email -->
    <div class="flex items-center justify-center gap-4 my-8 leading-none">
      <div class="border-b w-1/3 flex-1"></div>
      <div class="text-gray-400">یا ادامه با ایمیل</div>
      <div class="border-b w-1/3 flex-1"></div>
    </div>
  </div>
</template>
