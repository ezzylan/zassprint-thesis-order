<script setup lang="ts">
import { thesisOrderSchema } from "#imports";
import { useClipboard } from "@vueuse/core";
import { format } from "date-fns";

useHead({ title: "ZassPrint Thesis Order" });

const state = reactive({
  name: undefined,
  phone_num: undefined,
  thesis_type: undefined,
  cover_color: undefined,
  thesis_title: undefined,
  faculty: undefined,
  year: undefined,
  study_acronym: undefined,
  matrix_num: undefined,
  color_pages: undefined,
  black_white_pages: undefined,
  copies: undefined,
  cd_burn: false,
  cd_label: undefined,
  cd_copies: undefined,
  collection_date: new Date(),
  collection_method: undefined,
  address: undefined,
});

const form = ref();
const orderNo = ref("");
const isOpen = ref(false);
const loading = ref(false);
const toast = useToast();
const { copy } = useClipboard();

async function onSubmit() {
  form.value.clear();
  loading.value = true;

  try {
    orderNo.value = await $fetch("/api/thesisOrder", {
      method: "POST",
      body: {
        name: state.name,
        phone_num: state.phone_num,
        thesis_type: state.thesis_type,
        cover_color: state.cover_color,
        thesis_title: state.thesis_title,
        faculty: state.faculty,
        year: state.year,
        study_acronym: state.study_acronym,
        matrix_num: state.matrix_num,
        color_pages: state.color_pages,
        black_white_pages: state.black_white_pages,
        copies: state.copies,
        cd_label: state.cd_burn ? state.cd_label : undefined,
        cd_copies: state.cd_burn ? state.cd_copies : undefined,
        collection_date: state.collection_date,
        collection_method: state.collection_method,
        address:
          state.collection_method === "Delivery" ? state.address : undefined,
      },
    });

    loading.value = false;
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
        color="blue"
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
          <UFormGroup label="Full Name" name="name" required>
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Phone Number" name="phone_num" required>
            <UInput v-model="state.phone_num" type="tel" />
          </UFormGroup>
          <UFormGroup label="Matrix Number" name="matrix_num" required>
            <UInput v-model="state.matrix_num" />
          </UFormGroup>
        </div>

        <UDivider class="my-6" />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormGroup label="Type of Thesis" name="thesis_type" required>
            <USelectMenu
              v-model="state.thesis_type"
              :options="[
                'Hard Cover',
                'Soft Cover',
                'Comb Binding',
                'Tape Binding',
              ]"
              placeholder="Select thesis type"
            />
          </UFormGroup>
          <UFormGroup label="Cover Color" name="cover_color" required>
            <USelectMenu
              v-model="state.cover_color"
              :options="[
                'Research Report (Navy Blue)',
                'Dissertation/Thesis (Dark Red/Maroon)',
                'Ocean Blue',
                'Plastic Cover',
                'Other',
              ]"
              placeholder="Select cover color"
            />
          </UFormGroup>
        </div>

        <UDivider class="my-6" />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormGroup label="Thesis Title" name="thesis_title" required>
            <UInput v-model="state.thesis_title" />
          </UFormGroup>
          <UFormGroup label="Faculty" name="faculty" required>
            <UInput v-model="state.faculty" />
          </UFormGroup>
          <UFormGroup
            label="Year"
            name="year"
            type="number"
            min="2023"
            required
          >
            <UInput v-model="state.year" />
          </UFormGroup>
          <UFormGroup label="Study Acronym" name="study_acronym" required>
            <UInput v-model="state.study_acronym" />
          </UFormGroup>
        </div>

        <UDivider class="my-6" />

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <UFormGroup label="Color Pages" name="color_pages" required>
            <UInput v-model="state.color_pages" type="number" min="0" />
          </UFormGroup>
          <UFormGroup
            label="Black & White Pages"
            name="black_white_pages"
            required
          >
            <UInput v-model="state.black_white_pages" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Copies" name="copies" required>
            <UInput v-model="state.copies" type="number" min="1" />
          </UFormGroup>
        </div>

        <UDivider class="my-6" />

        <UFormGroup name="cd_burn">
          <UCheckbox v-model="state.cd_burn" label="CD Burn" />
        </UFormGroup>

        <div
          v-if="state.cd_burn"
          class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
        >
          <UFormGroup label="CD Label" name="cd_label">
            <USelectMenu
              v-model="state.cd_label"
              :options="['Sticker Label', 'Paper Label']"
              placeholder="Select CD label"
            />
          </UFormGroup>
          <UFormGroup label="Number of CD Copies" name="cd_copies">
            <UInput v-model="state.cd_copies" type="number" min="0" />
          </UFormGroup>
        </div>

        <UDivider class="my-6" />

        <div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <UFormGroup label="Collection Date" name="collection_date" required>
            <UPopover :popper="{ placement: 'top-start' }">
              <UButton
                variant="outline"
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(state.collection_date, 'd MMM, yyy')"
              />

              <template #panel="{ close }">
                <DatePicker
                  v-model="state.collection_date"
                  is-required
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Collection Method" name="collection_method">
            <USelectMenu
              v-model="state.collection_method"
              :options="['Delivery', 'Pick Up (Partnership Shop at Serdang)']"
              placeholder="Select collection method"
            />
          </UFormGroup>
        </div>

        <UFormGroup
          v-if="state.collection_method === 'Delivery'"
          label="Address"
          name="address"
        >
          <UTextarea
            v-model="state.address"
            placeholder="Write your delivery address here..."
          />
        </UFormGroup>

        <UButton :loading type="submit"> Submit </UButton>
      </UForm>

      <UModal v-model="isOpen" prevent-close>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
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
              <UButton label="OK" color="gray" @click="isOpen = false" />
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
