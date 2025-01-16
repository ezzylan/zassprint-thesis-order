<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { data } = await useFetch("/api/prices");
const prices = data.value ?? [];

const isPricingOpen = ref(false);
const isStatusOpen = ref(false);
const isEditPricesOpen = ref(false);

const items = [
  [
    {
      label: "Thesis Order Form",
      icon: "i-heroicons-clipboard-document-list-20-solid",
      click: async () => await navigateTo("/"),
    },
    {
      label: "Check Order",
      icon: "i-heroicons-magnifying-glass-20-solid",
      click: () => (isStatusOpen.value = true),
    },
  ],
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-inbox-arrow-down-20-solid",
      click: async () => await navigateTo("/admin/dashboard"),
    },
    {
      label: "Edit Prices",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (isEditPricesOpen.value = true),
    },
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle-20-solid",
      click: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error(error);
        else navigateTo("/");
      },
    },
  ],
];
</script>

<template>
  <header
    class="flex items-center justify-between border-b-2 px-4 py-3 lg:container lg:mx-auto"
  >
    <img class="h-14" src="/zass-logo.jpeg" alt="Zass Logo" />

    <div class="space-x-2">
      <template v-if="!user">
        <UButton color="red" @click="isStatusOpen = true">Check Order</UButton>
        <UButton color="gray" to="/login">Log In</UButton>
      </template>

      <UDropdown v-else :items="items" :popper="{ placement: 'bottom-end' }">
        <UButton
          color="white"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          class="space-x-2 shadow-sm hover:shadow-md"
        >
          <UAvatar alt="Zass Admin" size="sm" />
          <div class="hidden text-left sm:block">
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ user.email }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Superadmin</p>
          </div>
        </UButton>
      </UDropdown>
    </div>
  </header>

  <main class="min-h-screen bg-gray-100">
    <UContainer :ui="{ padding: 'py-4' }">
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ $attrs.title }}
        </h1>

        <UButton
          v-if="$attrs.title === 'Thesis Order Form'"
          @click="isPricingOpen = true"
          color="yellow"
        >
          Pricing
        </UButton>
      </div>

      <slot />
    </UContainer>
  </main>

  <UModal v-model="isPricingOpen" v-if="prices.length > 0">
    <div class="space-y-4 px-6 py-4">
      <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
        Price List
      </h4>
      <ul class="list-inside list-disc leading-7">
        <li>
          B&W - RM{{
            prices
              .find((price) => price.name === "blackWhite")
              ?.amount.toFixed(2)
          }}/page
        </li>
        <li>
          Color - RM{{
            prices.find((price) => price.name === "color")?.amount.toFixed(2)
          }}/page
        </li>
        <li>
          Hard/Soft Binding - RM{{
            prices
              .find((price) => price.name === "hardSoftBinding")
              ?.amount.toFixed(2)
          }}/book
        </li>
        <li>
          CD Burn & Label - RM{{
            prices
              .find((price) => price.name === "stickerLabel")
              ?.amount.toFixed(2)
          }}/piece or RM{{
            prices
              .find((price) => price.name === "paperLabel")
              ?.amount.toFixed(2)
          }}/piece
        </li>
        <li>Delivery Service - Based on Grab delivery price</li>
      </ul>
      <p>*can request for other courier services</p>
    </div>
  </UModal>

  <LazyCheckOrder v-model="isStatusOpen" />

  <LazyEditPrices v-model="isEditPricesOpen" />
</template>
