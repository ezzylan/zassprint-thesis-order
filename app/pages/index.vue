<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";

useHead({ title: "ZassPrint Thesis Order" });

const state = reactive<Partial<ThesisOrderSchema>>({
  name: undefined,
  phoneNumber: undefined,
  thesisType: undefined,
  coverColor: undefined,
  thesisTitle: undefined,
  faculty: undefined,
  year: MIN_YEAR,
  studyAcronym: undefined,
  matrixNumber: undefined,
  colorPages: MIN_COLOR_PAGES,
  blackWhitePages: MIN_BLACK_WHITE_PAGES,
  copies: MIN_COPIES,
  cdBurn: false,
  cdLabel: undefined,
  cdCopies: MIN_CD_COPIES,
  collectionDate: getInitDate(),
  collectionMethod: undefined,
  address: undefined,
});

const orderNo = ref("");
const isLoading = ref(false);

const toast = useToast();
const { copy } = useClipboard();

async function onSubmit(event: FormSubmitEvent<ThesisOrderSchema>) {
  isLoading.value = true;

  const thesisOrderBody: PostThesisOrder = {
    name: event.data.name,
    phoneNumber: event.data.phoneNumber,
    thesisType: event.data.thesisType,
    coverColor: event.data.coverColor,
    thesisTitle: event.data.thesisTitle,
    faculty: event.data.faculty,
    year: event.data.year,
    studyAcronym: event.data.studyAcronym,
    matrixNumber: event.data.matrixNumber,
    colorPages: event.data.colorPages,
    blackWhitePages: event.data.blackWhitePages,
    copies: event.data.copies,
    cdLabel: event.data.cdBurn ? event.data.cdLabel : undefined,
    cdCopies: event.data.cdBurn ? event.data.cdCopies : undefined,
    collectionDate: event.data.collectionDate.toString(),
    collectionMethod: event.data.collectionMethod,
    address:
      event.data.collectionMethod === "Delivery"
        ? event.data.address
        : undefined,
  };

  try {
    orderNo.value = await $fetch("/api/thesisOrder", {
      method: "POST",
      body: thesisOrderBody,
    });

    toast.add({
      title: "We have received your order!",
      description: `Here's your order number: #${orderNo.value}`,
      icon: "i-lucide-circle-check",
      color: "success",
      actions: [
        {
          icon: "i-lucide-copy",
          label: "Copy",
          onClick: () => copy(orderNo.value),
        },
      ],
      "onUpdate:open": (open) => {
        if (!open) {
          toast.add({
            title: "Order number copied!",
            icon: "i-lucide-circle-check",
            color: "success",
          });
        }
      },
    });
  } catch (err) {
    const error = err as FetchError;

    toast.add({
      title: error.name,
      description: error.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <NuxtLayout title="Thesis Order Form">
    <div class="space-y-8 py-4">
      <UAlert
        title="Thesis Order Process"
        icon="i-lucide-info"
        color="info"
        variant="subtle"
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
        :schema="thesisOrderSchema"
        :state
        class="space-y-4"
        @submit="onSubmit"
      >
        <PersonalInfoForm
          v-model:name="state.name"
          v-model:phoneNumber="state.phoneNumber"
          v-model:matrixNumber="state.matrixNumber"
        />

        <USeparator class="my-6" />

        <ThesisInfoForm
          v-model:thesis-type="state.thesisType"
          v-model:cover-color="state.coverColor"
          v-model:thesis-title="state.thesisTitle"
          v-model:faculty="state.faculty"
          v-model:year="state.year"
          v-model:study-acronym="state.studyAcronym"
        />

        <USeparator class="my-6" />

        <ThesisPagesForm
          v-model:color-pages="state.colorPages"
          v-model:black-white-pages="state.blackWhitePages"
          v-model:copies="state.copies"
        />

        <USeparator class="my-6" />

        <CdBurnForm
          v-model:cd-burn="state.cdBurn"
          v-model:cd-label="state.cdLabel"
          v-model:cd-copies="state.cdCopies"
        />

        <USeparator class="my-6" />

        <CollectionInfoForm
          v-model:collection-date="state.collectionDate as CalendarDate"
          v-model:collection-method="state.collectionMethod"
          v-model:address="state.address"
        />

        <div class="flex justify-end">
          <UButton :loading="isLoading" type="submit">
            {{ isLoading ? "Submitting..." : "Submit" }}
          </UButton>
        </div>
      </UForm>
    </div>
  </NuxtLayout>
</template>
