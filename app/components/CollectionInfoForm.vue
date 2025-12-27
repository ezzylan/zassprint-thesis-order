<script setup lang="ts">
import { CalendarDate, isWeekend } from "@internationalized/date";

const collectionDate = defineModel<CalendarDate>("collectionDate");
const collectionMethod = defineModel<string>("collectionMethod");
const address = defineModel<string>("address");

const initDate = getInitDate();
const inputDate = useTemplateRef("inputDate");
</script>

<template>
  <div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
    <UFormField
      label="Collection Date"
      name="collectionDate"
      help="Date format is MM / DD / YYYY"
      required
    >
      <UInputDate
        ref="inputDate"
        v-model="collectionDate"
        :min-value="initDate"
        :ui="{ base: 'w-full' }"
      >
        <template #trailing>
          <UPopover
            :reference="inputDate?.inputsRef[3]?.$el"
            :content="{ align: 'start', side: 'top' }"
          >
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-calendar"
              aria-label="Select a date"
              class="px-0"
            />

            <template #content>
              <UCalendar
                v-model="collectionDate"
                class="p-2"
                :year-controls="false"
                :min-value="initDate"
                :is-date-disabled="(date) => isWeekend(date, LOCALE)"
              />
            </template>
          </UPopover>
        </template>
      </UInputDate>
    </UFormField>

    <UFormField label="Collection Method" name="collectionMethod" required>
      <USelect
        v-model="collectionMethod"
        :items="['Delivery', 'Pick Up (Partnership Shop at Serdang)']"
        placeholder="Select collection method"
      />
    </UFormField>
  </div>

  <UFormField
    v-if="collectionMethod === 'Delivery'"
    label="Address"
    name="address"
  >
    <UTextarea
      v-model="address"
      placeholder="Write your delivery address here..."
    />
  </UFormField>
</template>
