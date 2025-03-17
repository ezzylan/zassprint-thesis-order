<script setup lang="ts">
import { format } from "date-fns";
import type { z } from "zod";

definePageMeta({
  middleware: [
    function () {
      const { loggedIn } = useUserSession();

      if (!loggedIn.value) {
        return navigateTo("/login");
      }
    },
  ],
});

useHead({ title: "Dashboard - ZassPrint Thesis Order" });

const columns = [
  {
    key: "orderNo",
    label: "Order No",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "receipt",
    label: "Receipt",
  },
  { key: "actions" },
];

const filtered = ref("");
const page = ref(1);
const pageCount = 10;

const { data, status, refresh } = await useLazyFetch("/api/thesisOrder", {
  headers: useRequestHeaders(["cookie"]),
});

const thesisOrders = computed(() => data.value ?? []);

const rows = computed(() => {
  if (!filtered.value) {
    return thesisOrders.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount,
    );
  }

  return thesisOrders.value
    .filter((order) => {
      return Object.values(order).some((value) => {
        return String(value)
          .toLowerCase()
          .includes(filtered.value.toLowerCase());
      });
    })
    .slice((page.value - 1) * pageCount, page.value * pageCount);
});

type ThesisOrder = z.output<typeof thesisOrderSchema> & { orderNo: string };

const selectedThesisOrder = ref<ThesisOrder>();
const isStatusOpen = ref(false);
const isDetailsOpen = ref(false);
const isDeleteOpen = ref(false);

const items = (row: ThesisOrder) => [
  [
    {
      label: "Change status",
      slot: "status",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        selectedThesisOrder.value = row;
        isStatusOpen.value = true;
      },
    },

    {
      label: "View order",
      icon: "i-heroicons-eye-20-solid",
      click: () => {
        selectedThesisOrder.value = row;
        isDetailsOpen.value = true;
      },
    },
  ],
  [
    {
      label: "Delete order",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        selectedThesisOrder.value = row;
        isDeleteOpen.value = true;
      },
    },
  ],
];

async function getReceipt(orderNo: string) {
  try {
    const response = await $fetch<ArrayBuffer>(`/api/receipt/${orderNo}`, {
      responseType: "arrayBuffer",
    });

    const blob = new Blob([new Uint8Array(response)], {
      type: "application/pdf",
    });
    const pdfUrl = URL.createObjectURL(blob);

    window.open(pdfUrl);
  } catch (err) {
    console.error(err);
  }
}

const toast = useToast();

async function updateStatus(
  orderNo: string,
  oldStatus: string,
  newStatus: string,
) {
  try {
    await $fetch("/api/orderStatus", {
      method: "POST",
      body: { orderNo, newStatus },
    });

    refresh();

    toast.add({
      title: `Order #${orderNo} status updated!`,
      description: `${oldStatus} → ${newStatus}`,
      actions: [
        {
          label: "Undo",
          onClick: () => {
            updateStatus(orderNo, newStatus, oldStatus);
          },
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
}

async function deleteOrder(orderNo: string) {
  try {
    await $fetch("/api/thesisOrder", {
      method: "DELETE",
      body: { orderNo },
    });

    refresh();
    isDeleteOpen.value = false;

    toast.add({ title: `Order #${orderNo} deleted!`, color: "success" });
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <NuxtLayout title="Dashboard">
    <UInput
      class="w-60 border-neutral-200 py-4"
      v-model="filtered"
      placeholder="Filter orders..."
    />

    <UTable
      :loading="status === 'pending'"
      class="rounded-md border bg-white"
      :rows
      :columns
    >
      <template #receipt-data="{ row }">
        <UButton
          color="neutral"
          icon="i-heroicons-receipt-percent-20-solid"
          @click="getReceipt(row.orderNo)"
        />
      </template>

      <template #actions-data="{ row }">
        <UDropdownMenu :items="items(row)" :ui="{ content: 'w-36' }">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />

          <template #status="{ item }">
            <UPopover mode="hover" :popper="{ placement: 'left' }">
              <UButton
                :padded="false"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-pencil-square-20-solid"
              >
                {{ item.label }}
              </UButton>

              <template #panel>
                <UButtonGroup orientation="vertical">
                  <div
                    class="p-1"
                    v-for="status in [
                      'Pending',
                      'Confirmed',
                      'Printed',
                      'Delivered',
                      'Cancelled',
                    ]"
                  >
                    <UButton
                      variant="ghost"
                      color="neutral"
                      @click="updateStatus(row.orderNo, row.status, status)"
                    >
                      {{ status }}
                    </UButton>
                  </div>
                </UButtonGroup>
              </template>
            </UPopover>
          </template>
        </UDropdownMenu>
      </template>
    </UTable>

    <div
      v-if="thesisOrders.length"
      class="flex justify-end border-neutral-200 px-3 py-4"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="thesisOrders.length"
      />
    </div>

    <UModal v-model="isDetailsOpen" v-if="selectedThesisOrder">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              {{ selectedThesisOrder.name }}
            </h4>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isDetailsOpen = false"
            />
          </div>
        </template>

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
                {{
                  selectedThesisOrder &&
                  format(selectedThesisOrder.collectionDate, "dd MMM yyyy")
                }}
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
      </UCard>
    </UModal>

    <UModal v-model="isDeleteOpen" v-if="selectedThesisOrder">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
        }"
      >
        <template #header>
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
            Delete order #{{ selectedThesisOrder.orderNo }}?
          </h4>
          <p class="leading-7">
            This action cannot be undone. This will permanently delete the order
            from the database.
          </p>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              @click="isDeleteOpen = false"
            />
            <UButton
              label="Continue"
              color="error"
              @click="deleteOrder(selectedThesisOrder.orderNo)"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </NuxtLayout>
</template>
