export const orderStatus = [
  "Pending",
  "Confirmed",
  "Printed",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof orderStatus)[number];

export const orderStatusColors = {
  Pending: "warning",
  Confirmed: "info",
  Printed: "neutral",
  Delivered: "success",
  Cancelled: "error",
} as const;
