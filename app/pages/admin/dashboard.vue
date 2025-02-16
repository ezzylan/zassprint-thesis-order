<script setup lang="ts">
import { format } from "date-fns";
import type { z } from "zod";

definePageMeta({ middleware: ["auth"] });

useHead({ title: "Dashboard - ZassPrint Thesis Order" });

const columns = [
  {
    key: "order_no",
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

type ThesisOrder = z.output<typeof thesisOrderSchema> & { order_no: string };

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
          click: () => {
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

    toast.add({ title: `Order #${orderNo} deleted!`, color: "red" });
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <NuxtLayout title="Dashboard">
    <UInput
      class="w-60 border-gray-200 py-4"
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
          color="gray"
          icon="i-heroicons-receipt-percent-20-solid"
          @click="getReceipt(row.order_no)"
        />
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)" :ui="{ width: 'w-36' }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />

          <template #status="{ item }">
            <UPopover mode="hover" :popper="{ placement: 'left' }">
              <UButton
                :padded="false"
                color="white"
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
                      color="white"
                      @click="updateStatus(row.order_no, row.status, status)"
                    >
                      {{ status }}
                    </UButton>
                  </div>
                </UButtonGroup>
              </template>
            </UPopover>
          </template>
        </UDropdown>
      </template>
    </UTable>

    <div
      v-if="thesisOrders.length"
      class="flex justify-end border-gray-200 px-3 py-4"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="thesisOrders.length"
      />
    </div>

    <UModal v-model="isDetailsOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              {{ selectedThesisOrder && selectedThesisOrder.name }}
            </h4>
            <UButton
              color="gray"
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
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.phone_num }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">Matrix Number</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.matrix_num }}
              </small>
            </div>
          </div>

          <UDivider />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-lg font-semibold">Type of Thesis</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.thesis_type }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">Cover Color</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.cover_color }}
              </small>
            </div>
          </div>

          <UDivider />

          <div>
            <p class="text-lg font-semibold">Thesis Title</p>
            <small class="text-sm font-medium leading-none">
              {{ selectedThesisOrder && selectedThesisOrder.thesis_title }}
            </small>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            <div>
              <p class="text-lg font-semibold">Faculty</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.faculty }}
              </small>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-lg font-semibold">Year</p>
                <small class="text-sm font-medium leading-none">
                  {{ selectedThesisOrder && selectedThesisOrder.year }}
                </small>
              </div>
              <div>
                <p class="text-lg font-semibold">Study Acronym</p>
                <small class="text-sm font-medium leading-none">
                  {{ selectedThesisOrder && selectedThesisOrder.study_acronym }}
                </small>
              </div>
            </div>
          </div>

          <UDivider />

          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-lg font-semibold">Color Pages</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.color_pages }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">B&W Pages</p>
              <small class="text-sm font-medium leading-none">
                {{
                  selectedThesisOrder && selectedThesisOrder.black_white_pages
                }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">Copies</p>
              <small class="text-sm font-medium leading-none">
                {{ selectedThesisOrder && selectedThesisOrder.copies }}
              </small>
            </div>
          </div>

          <div v-if="selectedThesisOrder && selectedThesisOrder.cd_label">
            <UDivider class="mb-4" />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-lg font-semibold">CD Label</p>
                <small class="text-sm font-medium leading-none">
                  {{ selectedThesisOrder.cd_label }}
                </small>
              </div>
              <div>
                <p class="text-lg font-semibold">CD Copies</p>
                <small class="text-sm font-medium leading-none">
                  {{ selectedThesisOrder.cd_copies }}
                </small>
              </div>
            </div>
          </div>

          <UDivider />

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            <div>
              <p class="text-lg font-semibold">Collection Date</p>
              <small class="text-sm font-medium leading-none">
                {{
                  selectedThesisOrder &&
                  format(selectedThesisOrder.collection_date, "dd MMM yyyy")
                }}
              </small>
            </div>
            <div>
              <p class="text-lg font-semibold">Collection Method</p>
              <small class="text-sm font-medium leading-none">
                {{
                  selectedThesisOrder && selectedThesisOrder.collection_method
                }}
              </small>
            </div>
          </div>

          <div
            v-if="selectedThesisOrder && selectedThesisOrder.address"
            class="mt-2 sm:mt-4"
          >
            <p class="text-lg font-semibold">Address</p>
            <small class="text-sm font-medium leading-none">
              {{ selectedThesisOrder.address }}
            </small>
          </div>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isDeleteOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
            Are you absolutely sure?
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
              color="gray"
              @click="isDeleteOpen = false"
            />
            <UButton
              label="Continue"
              color="red"
              @click="
                selectedThesisOrder && deleteOrder(selectedThesisOrder.order_no)
              "
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </NuxtLayout>
</template>
