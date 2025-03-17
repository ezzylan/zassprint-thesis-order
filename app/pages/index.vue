<script setup lang="ts">
import { thesisOrderSchema } from "#imports";
import { useClipboard } from "@vueuse/core";
import { format } from "date-fns";

useHead({ title: "ZassPrint Thesis Order" });

const state = reactive({
  name: undefined,
  phoneNumber: undefined,
  thesisType: undefined,
  coverColor: undefined,
  thesisTitle: undefined,
  faculty: undefined,
  year: undefined,
  studyAcronym: undefined,
  matrixNumber: undefined,
  colorPages: undefined,
  blackWhitePages: undefined,
  copies: undefined,
  cdBurn: false,
  cdLabel: undefined,
  cdCopies: undefined,
  collectionDate: new Date(),
  collectionMethod: undefined,
  address: undefined,
});

const form = ref();
const orderNo = ref("");
const isOpen = ref(false);
const isLoading = ref(false);
const toast = useToast();
const { copy } = useClipboard();

async function onSubmit() {
  form.value.clear();
  isLoading.value = true;

  try {
    orderNo.value = await $fetch("/api/thesisOrder", {
      method: "POST",
      body: {
        name: state.name,
        phoneNumber: state.phoneNumber,
        thesisType: state.thesisType,
        coverColor: state.coverColor,
        thesisTitle: state.thesisTitle,
        faculty: state.faculty,
        year: state.year,
        studyAcronym: state.studyAcronym,
        matrixNumber: state.matrixNumber,
        colorPages: state.colorPages,
        blackWhitePages: state.blackWhitePages,
        copies: state.copies,
        cdLabel: state.cdBurn ? state.cdLabel : undefined,
        cdCopies: state.cdBurn ? state.cdCopies : undefined,
        collectionDate: state.collectionDate,
        collectionMethod: state.collectionMethod,
        address:
          state.collectionMethod === "Delivery" ? state.address : undefined,
      },
    });

    isLoading.value = false;
    isOpen.value = true;
  } catch (err) {
    if (err.statusCode === 422) {
      form.value.setErrors(
        err.data.errors.map((err) => ({
          // Map validation errors to { path: string, message: string }
          message: err.message,
          path: err.path,
        })),
      );
    }
  }
}
</script>

<template>
  <NuxtLayout title="Thesis Order Form">
    <div class="space-y-4 py-4">
      <UAlert
        icon="i-heroicons-information-circle-20-solid"
        color="info"
        variant="subtle"
        title="Thesis Order Process"
      >
        <template #description>
          <ol class="list-inside list-decimal space-y-1">
            <li>Complete the online form.</li>
            <li>Receive a confirmation receipt.</li>
            <li>Submit a deposit payment.</li>
            <li>Your thesis processing begins upon payment.</li>
            <li>
              Choose pickup or opt for delivery (Express delivery/Shipping).
            </li>
            <li>Receive your thesis and make the final balance payment.</li>
          </ol>
        </template>
      </UAlert>

      <UForm
        ref="form"
        :schema="thesisOrderSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <UFormField label="Full Name" name="name" required>
            <UInput v-model="state.name" />
          </UFormField>
          <UFormField label="Phone Number" name="phoneNumber" required>
            <UInput v-model="state.phoneNumber" type="tel" />
          </UFormField>
          <UFormField label="Matrix Number" name="matrixNumber" required>
            <UInput v-model="state.matrixNumber" />
          </UFormField>
        </div>

        <USeparator class="my-6" />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormField label="Type of Thesis" name="thesisType" required>
            <USelectMenu
              v-model="state.thesisType"
              :options="[
                'Hard Cover',
                'Soft Cover',
                'Comb Binding',
                'Tape Binding',
              ]"
              placeholder="Select thesis type"
            />
          </UFormField>
          <UFormField label="Cover Color" name="coverColor" required>
            <USelectMenu
              v-model="state.coverColor"
              :options="[
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

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormField label="Thesis Title" name="thesisTitle" required>
            <UInput v-model="state.thesisTitle" />
          </UFormField>
          <UFormField label="Faculty" name="faculty" required>
            <UInput v-model="state.faculty" />
          </UFormField>
          <UFormField label="Year" name="year" required>
            <UInput v-model="state.year" type="number" min="2025" />
          </UFormField>
          <UFormField label="Study Acronym" name="studyAcronym" required>
            <UInput v-model="state.studyAcronym" />
          </UFormField>
        </div>

        <USeparator class="my-6" />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <UFormField label="Color Pages" name="colorPages" required>
            <UInput v-model="state.colorPages" type="number" min="0" />
          </UFormField>
          <UFormField
            label="Black & White Pages"
            name="blackWhitePages"
            required
          >
            <UInput v-model="state.blackWhitePages" type="number" min="0" />
          </UFormField>
          <UFormField label="Copies" name="copies" required>
            <UInput v-model="state.copies" type="number" min="1" />
          </UFormField>
        </div>

        <USeparator class="my-6" />

        <UFormField name="cdBurn">
          <UCheckbox v-model="state.cdBurn" label="CD Burn" />
        </UFormField>

        <div
          v-if="state.cdBurn"
          class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
        >
          <UFormField label="CD Label" name="cdLabel">
            <USelectMenu
              v-model="state.cdLabel"
              :options="['Sticker Label', 'Paper Label']"
              placeholder="Select CD label"
            />
          </UFormField>
          <UFormField label="Number of CD Copies" name="cdCopies">
            <UInput v-model="state.cdCopies" type="number" min="0" />
          </UFormField>
        </div>

        <USeparator class="my-6" />

        <div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormField label="Collection Date" name="collectionDate" required>
            <UPopover :popper="{ placement: 'top-start' }">
              <UButton
                variant="outline"
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(state.collectionDate, 'd MMM, yyy')"
              />

              <template #panel="{ close }">
                <DatePicker
                  v-model="state.collectionDate"
                  is-required
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormField>
          <UFormField
            label="Collection Method"
            name="collectionMethod"
            required
          >
            <USelectMenu
              v-model="state.collectionMethod"
              :options="['Delivery', 'Pick Up (Partnership Shop at Serdang)']"
              placeholder="Select collection method"
            />
          </UFormField>
        </div>

        <UFormField
          v-if="state.collectionMethod === 'Delivery'"
          label="Address"
          name="address"
        >
          <UTextarea
            v-model="state.address"
            placeholder="Write your delivery address here..."
          />
        </UFormField>

        <UButton :loading="isLoading" type="submit">
          {{ isLoading ? "Submitting..." : "Submit" }}
        </UButton>
      </UForm>

      <UModal v-model="isOpen" prevent-close>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
          }"
        >
          <template #header>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              We have received your order!
            </h4>
            <p class="leading-7">Here's your order number: #{{ orderNo }}</p>
          </template>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton label="OK" color="neutral" @click="isOpen = false" />
              <UButton
                label="Copy Order Number"
                @click="
                  () => {
                    copy(orderNo);
                    toast.add({
                      title: 'Order number copied!',
                      icon: 'i-heroicons-check-circle',
                      color: 'green',
                    });
                    isOpen = false;
                  }
                "
              />
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </NuxtLayout>
</template>
