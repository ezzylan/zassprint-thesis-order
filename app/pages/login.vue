<script setup lang="ts">
useHead({ title: "Login - ZassPrint Thesis Order" });

const { fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

const form = ref();
const toast = useToast();

async function signIn() {
  $fetch("/api/login", {
    method: "POST",
    body: credentials,
  })
    .then(async () => {
      await refreshSession();
      await navigateTo("/admin/dashboard");
    })
    .catch((error) =>
      toast.add({
        title: error.name,
        description: error.message,
        icon: "i-heroicons-x-circle",
        color: "red",
      }),
    );
}
</script>

<template>
  <main class="flex h-screen flex-col items-center justify-center gap-8">
    <div class="text-center">
      <img class="mx-auto h-20 w-auto" src="/zass-logo.jpeg" alt="Zass Logo" />
      <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Login to your account
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Welcome to Zass. Please login to continue.
      </p>
    </div>

    <UForm
      ref="form"
      :schema="loginSchema"
      :state="credentials"
      class="w-max space-y-6 md:w-96"
      @submit="signIn"
    >
      <div class="space-y-4">
        <UFormGroup name="email">
          <UInput
            v-model="credentials.email"
            placeholder="Email address"
            required
          />
        </UFormGroup>

        <UFormGroup name="password">
          <UInput
            v-model="credentials.password"
            type="password"
            placeholder="Password"
            required
          />
        </UFormGroup>
      </div>

      <UButton
        icon="i-heroicons-lock-closed"
        block
        type="submit"
        label="Sign In"
      />
    </UForm>

    <footer class="text-center text-xs text-gray-500">
      <nav class="mb-2 space-x-4">
        <a
          href="https://zass.app"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700"
          >About Us</a
        ><a
          href="https://zass.app/?page_id=282"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700"
          >Terms</a
        ><a
          href="https://zass.app/?page_id=265"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700"
          >Privacy Policy</a
        ><a
          href="https://zass.app/?page_id=277"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700"
          >Refund Policy</a
        >
      </nav>
      <p>Ann Wafa Resources (002742469-D) © 2025. All rights reserved</p>
    </footer>
  </main>
</template>
