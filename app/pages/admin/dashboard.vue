<script setup lang="ts">
import { LazyDeleteOrderModal, LazyViewOrderModal } from "#components";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import { getPaginationRowModel, type Column } from "@tanstack/vue-table";
import type { FetchError } from "ofetch";

definePageMeta({
  middleware: [
    function () {
      const { loggedIn } = useUserSession();
      if (!loggedIn.value) navigateTo("/login");
    },
  ],
});

useHead({ title: "Dashboard - ZassPrint Thesis Order" });

const { data, status, refresh } = await useLazyFetch("/api/thesisOrder", {
  headers: useRequestHeaders(["cookie"]),
});

const thesisOrders = computed(() => data.value ?? []);

const overlay = useOverlay();
const viewOrderModal = overlay.create(LazyViewOrderModal);
const deleteOrderModal = overlay.create(LazyDeleteOrderModal);

const getDropdownActions = (
  thesisOrder: SelectThesisOrder,
): DropdownMenuItem[][] => [
  [
    {
      label: "Change status",
      slot: "status" as const,
    },
    {
      label: "View order",
      icon: "i-lucide-eye",
      onSelect: () => viewOrderModal.open({ selectedThesisOrder: thesisOrder }),
    },
  ],
  [
    {
      label: "Delete order",
      icon: "i-lucide-trash-2",
      onSelect: () =>
        deleteOrderModal.open({ orderNo: thesisOrder.orderNo, refresh }),
    },
  ],
];

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UPopover = resolveComponent("UPopover");
const UButtonGroup = resolveComponent("UButtonGroup");
const UDropdownMenu = resolveComponent("UDropdownMenu");

function getHeader(column: Column<SelectThesisOrder>, label: string) {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: { align: "start" },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "Asc",
          type: "checkbox",
          icon: "i-lucide-arrow-up-narrow-wide",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") column.clearSorting();
            else column.toggleSorting(false);
          },
        },
        {
          label: "Desc",
          icon: "i-lucide-arrow-down-wide-narrow",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") column.clearSorting();
            else column.toggleSorting(true);
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-elevated",
        "aria-label": `Sort by ${isSorted === "asc" ? "descending" : "ascending"}`,
      }),
  );
}

const toast = useToast();

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
    const error = err as FetchError;

    toast.add({
      title: error.name,
      description: error.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  }
}

const columns: TableColumn<SelectThesisOrder>[] = [
  {
    accessorKey: "orderNo",
    header: ({ column }) => getHeader(column, "Order No"),
    cell: ({ row }) => `#${row.getValue("orderNo")}`,
  },
  {
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "Name"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => getHeader(column, "Status"),
    cell: ({ row }) => {
      const color = orderStatusColors[row.getValue("status") as OrderStatus];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("status"),
      );
    },
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
    cell: ({ row }) => {
      return h(UButton, {
        color: "neutral",
        icon: "i-lucide-receipt",
        onClick: () => getReceipt(row.original.orderNo),
      });
    },
  },
  {
    id: "actions",
  },
];

const table = useTemplateRef("table");

const globalFilter = ref("");
const sorting = ref([{ id: "orderNo", desc: true }]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });

async function updateStatus(
  orderNo: string,
  oldStatus: string,
  newStatus: string,
) {
  try {
    await $fetch("/api/orderStatus", {
      method: "POST",
      body: { orderNo, status: newStatus } as UpdateOrderStatusSchema,
    });

    await refresh();

    toast.add({
      title: `Order #${orderNo} status updated!`,
      description: `${oldStatus} → ${newStatus}`,
      color: "success",
      actions: [
        {
          label: "Undo",
          onClick: () => updateStatus(orderNo, newStatus, oldStatus),
        },
      ],
    });
  } catch (err) {
    const error = err as FetchError;

    toast.add({
      title: error.name,
      description: error.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  }
}
</script>

<template>
  <NuxtLayout title="Dashboard">
    <div class="flex w-full flex-1 flex-col gap-4">
      <UInput
        class="w-60"
        v-model="globalFilter"
        placeholder="Filter orders..."
      />

      <UTable
        ref="table"
        :data="thesisOrders"
        :columns
        :loading="status === 'pending'"
        v-model:sorting="sorting"
        v-model:global-filter="globalFilter"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        sticky
        class="rounded-md border bg-white"
      >
        <template #actions-cell="{ row }">
          <UDropdownMenu
            :items="getDropdownActions(row.original)"
            aria-label="Actions dropdown"
          >
            <UButton
              icon="i-lucide-ellipsis"
              color="neutral"
              variant="ghost"
              class="ml-auto"
              aria-label="Actions dropdown"
            />

            <template #status="{ item }">
              <UPopover mode="hover" :content="{ side: 'left' }">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-square-pen"
                  class="p-0"
                >
                  {{ item.label }}
                </UButton>

                <template #content>
                  <UButtonGroup orientation="vertical">
                    <div class="p-1" v-for="status in orderStatus">
                      <UButton
                        variant="ghost"
                        color="neutral"
                        :trailing-icon="
                          status === row.original.status ? 'i-lucide-check' : ''
                        "
                        @click="
                          updateStatus(
                            row.original.orderNo,
                            row.original.status,
                            status,
                          )
                        "
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

      <div v-if="thesisOrders.length" class="flex justify-end">
        <UPagination
          :default-page="
            (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
          "
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
