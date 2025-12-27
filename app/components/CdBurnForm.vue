<script setup lang="ts">
const cdBurn = defineModel<boolean>("cdBurn");
const cdLabel = defineModel<string>("cdLabel");
const cdCopies = defineModel<number>("cdCopies");
</script>

<template>
  <UFormField name="cdBurn">
    <UCheckbox v-model="cdBurn" label="CD Burn" />
  </UFormField>

  <div v-if="cdBurn" class="grid grid-cols-2 gap-4">
    <UFormField label="CD Label" name="cdLabel">
      <USelect
        v-model="cdLabel"
        :items="['Sticker Label', 'Paper Label']"
        placeholder="Select CD label"
      />
    </UFormField>
    <UFormField label="Number of CD Copies" name="cdCopies">
      <UInputNumber v-model="cdCopies" :min="MIN_CD_COPIES" />
    </UFormField>
  </div>
</template>
