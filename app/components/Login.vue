<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

const form = ref();
const toast = useToast();
const isLoading = ref(false);
const isPwVisible = ref(false);

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
        color: "error",
      });

      isLoading.value = false;
    });
}
</script>

<template>
  <UModal :ui="{ content: 'sm:max-w-md' }">
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
              :type="isPwVisible ? 'text' : 'password'"
              placeholder="password123"
              required
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="
                    isPwVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  :aria-label="isPwVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="isPwVisible"
                  aria-controls="password"
                  @click="isPwVisible = !isPwVisible"
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
