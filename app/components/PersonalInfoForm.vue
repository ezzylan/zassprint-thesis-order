<script setup lang="ts">
const name = defineModel<string>("name");
const phoneNumber = defineModel<string>("phoneNumber");
const matrixNumber = defineModel<string>("matrixNumber");
</script>

<template>
  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
    <UFormField
      label="Full Name"
      name="name"
      required
      class="col-span-2 sm:col-span-2"
    >
      <UInput v-model="name" />
    </UFormField>
    <UFormField label="Phone Number" name="phoneNumber" required>
      <UInput v-model="phoneNumber" type="tel" />
    </UFormField>
    <UFormField label="Matrix Number" name="matrixNumber" required>
      <UInput v-model="matrixNumber" />
    </UFormField>
  </div>
</template>
