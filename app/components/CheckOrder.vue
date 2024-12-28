<script setup lang="ts">
const form = ref();
const toast = useToast();

const state = reactive({
  orderNo: undefined,
});

async function onSubmit() {
  try {
    const response = await $fetch(`/api/orderStatus?orderNo=${state.orderNo}`);

    toast.add({
      title: `Your order is ${response && response.toLowerCase()}.`,
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
    } else {
      toast.add({
        title: `Order #${state.orderNo} not found.`,
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  }
}
</script>

<template>
  <UModal :ui="{ width: 'w-72' }">
    <div class="space-y-4 p-4">
      <h3
        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
      >
        Enter your order number here:
      </h3>

      <UForm
        ref="form"
        :schema="orderStatusSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup name="orderNo">
          <UInput v-model="state.orderNo" />
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </div>
  </UModal>
</template>
