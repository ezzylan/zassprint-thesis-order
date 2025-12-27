<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";

const state = reactive<Partial<PricesSchema>>({
  blackWhite: await getPrice("blackWhite"),
  color: await getPrice("color"),
  binding: await getPrice("hardSoftBinding"),
  stickerLabel: await getPrice("stickerLabel"),
  paperLabel: await getPrice("paperLabel"),
  delivery: await getPrice("delivery"),
});

const toast = useToast();
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<PricesSchema>) {
  isLoading.value = true;

  try {
    await $fetch("/api/prices", { method: "POST", body: event.data });

    toast.add({
      title: "Prices updated!",
      icon: "i-lucide-circle-check",
      color: "success",
    });
  } catch (err) {
    const error = err as FetchError;

    toast.add({
      title: error.name,
      description: error.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal title="Edit Prices">
    <template #body class="space-y-4 p-4">
      <UForm :schema="pricesSchema" :state class="space-y-4" @submit="onSubmit">
        <div class="grid grid-flow-col grid-rows-3 gap-4 md:grid-rows-2">
          <UFormField label="Black & White" name="blackWhite">
            <UInputNumber
              v-model="state.blackWhite"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>
          <UFormField label="Color" name="color">
            <UInputNumber
              v-model="state.color"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>
          <UFormField label="Hard/Soft Binding" name="binding">
            <UInputNumber
              v-model="state.binding"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>

          <UFormField label="Sticker Label" name="stickerLabel">
            <UInputNumber
              v-model="state.stickerLabel"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>
          <UFormField label="Paper Label" name="paperLabel">
            <UInputNumber
              v-model="state.paperLabel"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>
          <UFormField label="Delivery" name="delivery">
            <UInputNumber
              v-model="state.delivery"
              :min="MIN_PRICE"
              :step="PRICE_STEP"
            />
          </UFormField>
        </div>

        <div class="flex justify-end">
          <UButton :loading="isLoading" type="submit">
            {{ isLoading ? "Submitting..." : "Submit" }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
