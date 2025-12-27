<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
  },
];

const toast = useToast();
const isLoading = ref(false);

const { fetch: refreshSession } = useUserSession();

const emit = defineEmits<{ close: [boolean] }>();

async function onSubmit(payload: FormSubmitEvent<LoginSchema>) {
  isLoading.value = true;

  try {
    await $fetch("/api/login", { method: "POST", body: payload.data });
    await refreshSession();
    emit("close", true);
    await navigateTo("/admin/dashboard");
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
  <UModal :ui="{ content: 'p-6 w-xs' }">
    <template #content>
      <UAuthForm
        :schema="loginSchema"
        title="Login"
        description="Enter your credentials to continue."
        :fields
        @submit="onSubmit"
        :submit="{
          loading: isLoading,
          label: isLoading ? 'Logging in...' : 'Login',
        }"
      />
    </template>
  </UModal>
</template>
