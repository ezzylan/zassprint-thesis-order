<script setup lang="ts">
const blackWhitePrice = await getPrice("blackWhite").then((price) =>
  price?.toFixed(2),
);

const colorPrice = await getPrice("color").then((price) => price?.toFixed(2));

const bindingPrice = await getPrice("hardSoftBinding").then((price) =>
  price?.toFixed(2),
);

const stickerLabelPrice = await getPrice("stickerLabel").then((price) =>
  price?.toFixed(2),
);

const paperLabelPrice = await getPrice("paperLabel").then((price) =>
  price?.toFixed(2),
);
</script>

<template>
  <UModal title="Price List" :ui="{ header: 'p-6', body: 'space-y-4 p-6' }">
    <template #body>
      <ul class="list-inside list-disc leading-7">
        <li>
          Black & White -
          <strong>RM{{ blackWhitePrice }}</strong
          >/page
        </li>
        <li>
          Color -
          <strong>RM{{ colorPrice }}</strong
          >/page
        </li>
        <li>
          Hard/Soft Binding -
          <strong>RM{{ bindingPrice }}</strong
          >/book
        </li>
        <li>
          CD Burn & Label -
          <strong>RM{{ stickerLabelPrice }}</strong
          >/piece or <strong>RM{{ paperLabelPrice }}</strong
          >/piece
        </li>
        <li>
          Delivery Service - Based on <strong>Grab delivery price</strong>
        </li>
      </ul>

      <UAlert
        title="You can request for other courier services as well"
        icon="i-lucide-info"
        color="info"
        variant="subtle"
      />
    </template>
  </UModal>
</template>
