<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

const state = reactive<Partial<GetOrderStatusSchema>>({
  orderNo: undefined,
});

type ClassVariant = "warning" | "info" | "neutral" | "success" | "error";

const isLoading = ref(false);
const message = ref<string>();
const orderStatus = ref<OrderStatus>();
const messageClass = ref<`text-${ClassVariant}`>();

async function onSubmit(event: FormSubmitEvent<GetOrderStatusSchema>) {
  isLoading.value = true;

  try {
    orderStatus.value = await $fetch("/api/orderStatus", { query: event.data });

    message.value = `Your order ${orderStatus.value === "Delivered" ? "has been" : "is"} ${orderStatus.value?.toLowerCase()}.`;

    messageClass.value = `text-${orderStatusColors[orderStatus.value as OrderStatus]}`;
  } catch (err) {
    message.value = `Order #${event.data.orderNo} not found.`;
    messageClass.value = "text-error";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal title="Enter your order number here:" :ui="{ content: 'w-xs' }">
    <template #body>
      <UForm
        :schema="getOrderStatusSchema"
        :state
        class="flex items-start gap-4"
        @submit="onSubmit"
      >
        <UFormField name="orderNo" :help="message" :ui="{ help: messageClass }">
          <UInput v-model="state.orderNo" />
        </UFormField>

        <UButton type="submit" :loading="isLoading">
          {{ isLoading ? "Checking..." : "Check" }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
