<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

const form = ref();
const toast = useToast();
const isLoading = ref(false);
const passwordVisible = ref(false);

const eyeIcon = computed(() =>
  passwordVisible.value ? "i-heroicons-eye-slash" : "i-heroicons-eye",
);

const pwInputType = computed(() =>
  passwordVisible.value ? "text" : "password",
);

async function login() {
  isLoading.value = true;

  $fetch("/api/login", {
    method: "POST",
    body: credentials,
  })
    .then(async () => {
      await refreshSession();
      await navigateTo("/admin/dashboard");
    })
    .catch((error) => {
      toast.add({
        title: error.name,
        description: error.message,
        icon: "i-heroicons-x-circle",
        color: "red",
      });

      isLoading.value = false;
    });
}
</script>

<template>
  <UModal :ui="{ width: 'sm:max-w-md' }">
    <div class="flex flex-col items-center justify-center gap-2 space-y-4 p-8">
      <div class="space-y-2 text-center">
        <h2 class="text-3xl font-bold tracking-tight text-neutral-900">
          Sign In
        </h2>
        <p class="text-sm text-neutral-600">
          Enter your credentials below to continue.
        </p>
      </div>

      <UForm
        ref="form"
        :schema="loginSchema"
        :state="credentials"
        class="w-max space-y-6 sm:w-96"
        @submit="login"
      >
        <div class="space-y-4">
          <UFormField label="Email" name="email">
            <UInput
              v-model="credentials.email"
              placeholder="test@example.com"
              required
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="credentials.password"
              :type="pwInputType"
              placeholder="password123"
              required
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  :icon="eyeIcon"
                  :padded="false"
                  @click="passwordVisible = !passwordVisible"
                />
              </template>
            </UInput>
          </UFormField>
        </div>

        <UButton block type="submit" :loading="isLoading">
          {{ isLoading ? "Signing In..." : "Sign In" }}
        </UButton>
      </UForm>
    </div>
  </UModal>
</template>
