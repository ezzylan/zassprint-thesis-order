<script setup lang="ts">
import type { FetchError } from "ofetch";

const { orderNo, refresh } = defineProps<{
  orderNo: string;
  refresh: () => Promise<void>;
}>();

const emit = defineEmits<{ close: [boolean] }>();

const toast = useToast();

async function deleteOrder() {
  try {
    await $fetch("/api/thesisOrder", { method: "DELETE", body: { orderNo } });

    await refresh();
    emit("close", true);

    toast.add({ title: `Order #${orderNo} deleted!`, color: "success" });
  } catch (err) {
    const error = err as FetchError;

    toast.add({
      title: error.name,
      description: error.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    :title="`Delete order #${orderNo}?`"
    description="This action cannot be undone. This will permanently delete the order from the database."
    :ui="{ footer: 'justify-end' }"
    :close="false"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" @click="emit('close', true)" />
        <UButton label="Continue" color="error" @click="deleteOrder" />
      </div>
    </template>
  </UModal>
</template>
