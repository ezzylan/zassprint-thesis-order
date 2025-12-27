<script setup lang="ts">
import { format } from "date-fns";

defineProps<{ selectedThesisOrder: SelectThesisOrder }>();
</script>

<template>
  <UModal :title="selectedThesisOrder.name">
    <template #body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-lg font-semibold">Phone Number</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.phoneNumber }}
            </small>
          </div>
          <div>
            <p class="text-lg font-semibold">Matrix Number</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.matrixNumber }}
            </small>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-lg font-semibold">Type of Thesis</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.thesisType }}
            </small>
          </div>
          <div>
            <p class="text-lg font-semibold">Cover Color</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.coverColor }}
            </small>
          </div>
        </div>

        <USeparator />

        <div>
          <p class="text-lg font-semibold">Thesis Title</p>
          <small class="text-sm leading-none font-medium">
            {{ selectedThesisOrder.thesisTitle }}
          </small>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <div>
            <p class="text-lg font-semibold">Faculty</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.faculty }}
            </small>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-lg font-semibold">Year</p>
              <small class="text-sm leading-none font-medium">
                {{ selectedThesisOrder.year }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">Study Acronym</p>
              <small class="text-sm leading-none font-medium">
                {{ selectedThesisOrder.studyAcronym }}
              </small>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-lg font-semibold">Color Pages</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.colorPages }}
            </small>
          </div>
          <div>
            <p class="text-lg font-semibold">B&W Pages</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.blackWhitePages }}
            </small>
          </div>
          <div>
            <p class="text-lg font-semibold">Copies</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.copies }}
            </small>
          </div>
        </div>

        <div v-if="selectedThesisOrder.cdLabel">
          <USeparator class="mb-4" />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-lg font-semibold">CD Label</p>
              <small class="text-sm leading-none font-medium">
                {{ selectedThesisOrder.cdLabel }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">CD Copies</p>
              <small class="text-sm leading-none font-medium">
                {{ selectedThesisOrder.cdCopies }}
              </small>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <div>
            <p class="text-lg font-semibold">Collection Date</p>
            <small class="text-sm leading-none font-medium">
              {{ format(selectedThesisOrder.collectionDate, "dd MMM yyyy") }}
            </small>
          </div>
          <div>
            <p class="text-lg font-semibold">Collection Method</p>
            <small class="text-sm leading-none font-medium">
              {{ selectedThesisOrder.collectionMethod }}
            </small>
          </div>
        </div>

        <div v-if="selectedThesisOrder.address" class="mt-2 sm:mt-4">
          <p class="text-lg font-semibold">Address</p>
          <small class="text-sm leading-none font-medium">
            {{ selectedThesisOrder.address }}
          </small>
        </div>
      </div>
    </template>
  </UModal>
</template>
