<script setup lang="ts">
const thesisType = defineModel<string>("thesisType");
const coverColor = defineModel<string>("coverColor");
const thesisTitle = defineModel<string>("thesisTitle");
const faculty = defineModel<string>("faculty");
const year = defineModel<number>("year");
const studyAcronym = defineModel<string>("studyAcronym");
</script>

<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
    <UFormField label="Type of Thesis" name="thesisType" required>
      <USelect
        v-model="thesisType"
        :items="['Hard Cover', 'Soft Cover', 'Comb Binding', 'Tape Binding']"
        placeholder="Select thesis type"
      />
    </UFormField>
    <UFormField label="Cover Color" name="coverColor" required>
      <USelect
        v-model="coverColor"
        :items="[
          'Research Report (Navy Blue)',
          'Dissertation/Thesis (Dark Red/Maroon)',
          'Ocean Blue',
          'Plastic Cover',
          'Other',
        ]"
        placeholder="Select cover color"
      />
    </UFormField>
  </div>

  <USeparator class="my-6" />

  <UFormField label="Thesis Title" name="thesisTitle" required>
    <UTextarea v-model="thesisTitle" />
  </UFormField>

  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
    <UFormField label="Faculty" name="faculty" required class="col-span-2">
      <UInput v-model="faculty" />
    </UFormField>
    <UFormField label="Year" name="year" required>
      <UInputNumber
        v-model="year"
        :min="MIN_YEAR"
        :format-options="{ useGrouping: false }"
      />
    </UFormField>
    <UFormField label="Study Acronym" name="studyAcronym" required>
      <UInput v-model="studyAcronym" />
    </UFormField>
  </div>
</template>
