<script setup lang="ts">
const colorPages = defineModel<number>("colorPages");
const blackWhitePages = defineModel<number>("blackWhitePages");
const copies = defineModel<number>("copies");
</script>

<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
    <UFormField label="Color Pages" name="colorPages" required>
      <UInputNumber v-model="colorPages" :min="MIN_COLOR_PAGES" />
    </UFormField>
    <UFormField label="Black & White Pages" name="blackWhitePages" required>
      <UInputNumber v-model="blackWhitePages" :min="MIN_BLACK_WHITE_PAGES" />
    </UFormField>
    <UFormField label="Copies" name="copies" required>
      <UInputNumber v-model="copies" :min="MIN_COPIES" />
    </UFormField>
  </div>
</template>
