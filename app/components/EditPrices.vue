<script setup lang="ts">
import type { z } from "zod";

const { data } = await useFetch("/api/prices");
const prices = data.value ?? [];

type Schema = z.output<typeof pricesSchema>;

const state = reactive({
  blackWhite: prices?.find((price) => price.name === "blackWhite")?.amount,
  color: prices?.find((price) => price.name === "color")?.amount,
  binding: prices?.find((price) => price.name === "hardSoftBinding")?.amount,
  stickerLabel: prices?.find((price) => price.name === "stickerLabel")?.amount,
  paperLabel: prices?.find((price) => price.name === "paperLabel")?.amount,
  delivery: prices?.find((price) => price.name === "delivery")?.amount,
});

const form = ref();
const toast = useToast();

async function onSubmit() {
  try {
    await $fetch("/api/prices", {
      method: "POST",
      body: state,
    });

    toast.add({
      title: "Prices updated!",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  } catch (err) {
    if (err.statusCode === 422) {
      form.value.setErrors(
        err.data.errors.map((err) => ({
          // Map validation errors to { path: string, message: string }
          message: err.message,
          path: err.path,
        })),
      );
    }
  }
}
</script>

<template>
  <UModal>
    <div class="space-y-4 p-4">
      <h3
        class="text-base leading-6 font-semibold text-neutral-900 dark:text-white"
      >
        Edit Prices
      </h3>

      <UForm
        ref="form"
        :schema="pricesSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-flow-col grid-rows-3 gap-4 md:grid-rows-2">
          <UFormGroup label="Black & White" name="blackWhite">
            <UInput v-model="state.blackWhite" type="number" step="0.1" />
          </UFormGroup>
          <UFormGroup label="Color" name="color">
            <UInput v-model="state.color" type="number" step="0.1" />
          </UFormGroup>
          <UFormGroup label="Hard/Soft Binding" name="binding">
            <UInput v-model="state.binding" type="number" step="0.1" />
          </UFormGroup>

          <UFormGroup label="Sticker Label" name="stickerLabel">
            <UInput v-model="state.stickerLabel" type="number" step="0.1" />
          </UFormGroup>
          <UFormGroup label="Paper Label" name="paperLabel">
            <UInput v-model="state.paperLabel" type="number" step="0.1" />
          </UFormGroup>
          <UFormGroup label="Delivery" name="delivery">
            <UInput v-model="state.delivery" type="number" step="0.1" />
          </UFormGroup>
        </div>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </div>
  </UModal>
</template>
