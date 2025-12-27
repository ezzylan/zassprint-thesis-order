<script setup lang="ts">
import {
  LazyCheckOrderModal,
  LazyEditPricesModal,
  LazyLoginModal,
  LazyPricingModal,
} from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";

const { user, clear: clearSession } = useUserSession();

const attrs = useAttrs();
const title = attrs.title as string;

const overlay = useOverlay();

const loginModal = overlay.create(LazyLoginModal);
const pricingModal = overlay.create(LazyPricingModal);
const editPricesModal = overlay.create(LazyEditPricesModal);
const checkOrderModal = overlay.create(LazyCheckOrderModal);

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Thesis Order Form",
      icon: "i-lucide-clipboard-pen",
      onClick: async () => await navigateTo("/"),
    },
    {
      label: "Check Order",
      icon: "i-lucide-search",
      onClick: () => checkOrderModal.open(),
    },
  ],
  [
    {
      label: "Dashboard",
      icon: "i-lucide-inbox",
      onClick: async () => await navigateTo("/admin/dashboard"),
    },
    {
      label: "Edit Prices",
      icon: "i-lucide-square-pen",
      onClick: () => editPricesModal.open(),
    },
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onClick: async () => {
        await clearSession();
        await navigateTo("/");
      },
    },
  ],
]);
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <img class="h-14" src="/zass-logo.jpeg" alt="Zass Logo" />
    </template>

    <template #right>
      <UDropdownMenu v-if="user" :items :content="{ align: 'end' }">
        <UButton
          color="neutral"
          trailing-icon="i-lucide-chevron-down"
          class="space-x-2 shadow-sm hover:shadow-md"
        >
          <UAvatar :alt="user.name" size="sm" />
          <div class="hidden text-left sm:block">
            <p class="text-sm font-semibold">{{ user.email }}</p>
            <p class="text-muted text-xs">{{ user.name }}</p>
          </div>
        </UButton>
      </UDropdownMenu>

      <template v-else>
        <UButton color="secondary" @click="checkOrderModal.open()">
          Check Order
        </UButton>
        <UButton @click="loginModal.open()">Log In</UButton>
      </template>
    </template>
  </UHeader>

  <UPage class="bg-neutral-100">
    <UContainer>
      <UPageHeader
        :title
        :ui="{
          root: 'border-0 py-4',
          wrapper: 'sm:flex-row sm:items-center sm:justify-between',
        }"
      >
        <template #links>
          <UButton
            v-if="$attrs.title === 'Thesis Order Form'"
            @click="pricingModal.open()"
            color="warning"
            icon="i-lucide-badge-percent"
          >
            Pricing
          </UButton>
        </template>
      </UPageHeader>

      <UPageBody class="mt-0 pb-4">
        <slot />
      </UPageBody>
    </UContainer>
  </UPage>
</template>
