<template>
  <div class="container min-h-[600px]">
    <div v-if="showLoader" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto"/>
    </div>
    <div v-if="false" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto"/>
    </div>
    <template v-else>
      <div class="flex flex-col items-start justify-between w-full lg:gap-12 mb-24 lg:flex-row">
        <div class="mt-2 lg:sticky top-16 w-full lg:max-w-[260px]">
          <section class="my-8 flex gap-4 items-start justify-center w-full">
            <img src="/images/avatar_placeholder.jpg" class="rounded-full aspect-square border border-white" alt="user-image"
                 width="48" height="48"/>
            <div class="flex-1 text-balance leading-tight w-full text-ellipsis overflow-hidden">
              <div class="text-lg font-semibold">خوش آمدید, {{dataUserStore.dataUser?.name}}</div>
              <span v-if="viewer?.email" class="text-gray-400 font-light" :title="viewer?.email">{{dataUserStore.dataUser?.email }}</span>
            </div>
            <button
                class="flex text-gray-700 items-center flex-col p-2 px-4 rounded-lg hover:bg-white hover:text-red-700 lg:hidden"
                @click="logOutUser">
              <LoadingIcon v-if="isPending" size="22" color="#B91C1B"/>
              <Icon v-else name="ion:log-out-outline" size="22"/>
              <small>{{ $t('messages.account.logout') }}</small>
            </button>
          </section>
          <hr class="my-8"/>
          <nav class="flex text-gray-700 lg:grid flex-wrap w-full gap-1.5 my-8 min-w-[240px] lg:w-auto items-start">
            <NuxtLink to="/my-account?tab=my-details" class="flex items-center gap-4 p-2 px-4"
                      :class="{ active: activeTab == 'my-details' }">
              <span class="mdi mdi-24px mdi-information-outline" />
              {{ $t('messages.general.myDetails') }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=authentication" class="flex items-center gap-4 p-2 px-4"
                      :class="{ active: activeTab == 'my-details' }">
              <span class="mdi mdi-24px mdi-information-outline" />
              {{ $t('احراز هویت') }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=orders" class="flex items-center gap-4 p-2 px-4"
                      :class="{ active: activeTab == 'orders' }">
              <span class="mdi mdi-24px mdi-bag-personal-outline" />
              {{ $t('messages.shop.order', 2) }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=bank-transaction" class="flex items-center gap-4 p-2 px-4"
                      :class="{ active: activeTab == 'bank-transaction' }">
              <span class="mdi mdi-24px mdi-cash-clock" />
              {{ $t('تراکنش های بانکی') }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=wishlist" class="flex items-center gap-4 p-2 px-4"
                      :class="{ active: activeTab == 'wishlist' }">
              <span class="mdi mdi-24px mdi-heart-outline" />
              علاقه مندی
            </NuxtLink>
          </nav>
          <div class="hidden lg:block">
            <hr class="my-8"/>
            <button
                class="flex text-gray-700 items-center gap-4 p-2 px-4 w-full rounded-lg hover:bg-white hover:text-red-700"
                @click="logOutUser">
              <LoadingIcon v-if="isPending" size="22"/>
              <span v-else class="mdi mdi-24px mdi-logout" />
              {{ $t('messages.account.logout') }}
            </button>
          </div>
        </div>

        <main class="flex-1 w-full lg:my-8 rounded-lg max-w-screen-lg lg:sticky top-24">
          <AccountMyDetails v-if="activeTab === 'my-details'" />
          <CustomOrderList v-else-if="activeTab === 'orders'"/>
          <CustomOrderList v-else-if="activeTab === 'bank-transaction'"/>
          <WishList v-else-if="activeTab === 'wishlist'"/>
        </main>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import LoadingIcon from "~/components/generalElements/LoadingIcon.vue";
import WishList from "~/components/shopElements/WishList.vue";
import {useLoginStore} from "~/stores/loginStore";
import {useAuth} from "~/composables/useAuth";
import {useDataUserStore} from "~/stores/userDataStore";
import CustomOrderList from "~/components/CustomOrderList.vue";
const loginStore = useLoginStore()
const router = useRouter();
const route = useRoute();

const isPending = ref<boolean>(false)
const dataUserStore= useDataUserStore()
const {isLogin} = useAuth()
const activeTab = computed(() => route.query.tab || 'my-details');
const showLoader = false

const logOutUser = async () => {
  isPending.value = true;
  try {
    await loginStore.logout();
  } catch (error) {
  } finally {
    isPending.value = false;
  }
};

useSeoMeta({
  title: `My Account`,
});
onMounted(async ()=>{
  if (!loginStore.isAuthenticated){
    await router.push('/login')
  }
  await dataUserStore.getUserData()
})
</script>
<style lang="postcss" scoped>
nav a {
  @apply rounded-md;

  &.active,
  &:focus,
  &:hover {
    @apply bg-white shadow;
  }

  & svg {
    @media (max-width: 640px) {
      display: none !important;
    }
  }
}
</style>
