import { CalendarDate } from "@internationalized/date";
import * as z from "zod";
// import { MIN_YEAR } from "./constants";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type LoginSchema = z.output<typeof loginSchema>;

export const thesisOrderSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().min(10),
  thesisType: z.string("Please select a thesis export type"),
  coverColor: z.string("Please select a cover color"),
  thesisTitle: z.string().nonempty(),
  faculty: z.string().nonempty(),
  year: z.coerce.number().int().gte(2025),
  studyAcronym: z.string().nonempty(),
  matrixNumber: z.string().min(8),
  colorPages: z.coerce.number().int().nonnegative(),
  blackWhitePages: z.coerce.number().int().nonnegative(),
  copies: z.coerce.number().int().positive().default(1),
  cdBurn: z.boolean().default(false),
  cdLabel: z.string().optional(),
  cdCopies: z.coerce.number().int().nonnegative().optional(),
  collectionDate: z.instanceof(CalendarDate, {
    message: "Please select a collection date",
  }),
  collectionMethod: z.string("Please select a collection method"),
  address: z.string().optional(),
});

export type ThesisOrderSchema = z.output<typeof thesisOrderSchema>;

export const getOrderStatusSchema = z.object({
  orderNo: z.coerce
    .number()
    .gte(1000000, "Order number must be 7 digits")
    .lte(9999999, "Order number must be 7 digits"),
});

export type GetOrderStatusSchema = z.output<typeof getOrderStatusSchema>;

export const updateOrderStatusSchema = z.object({
  orderNo: z.string().length(7, "Order number must be 7 digits"),
  status: z.string(),
});

export type UpdateOrderStatusSchema = z.output<typeof updateOrderStatusSchema>;

export const pricesSchema = z.object({
  blackWhite: z.coerce.number().nonnegative(),
  color: z.coerce.number().nonnegative(),
  binding: z.coerce.number().nonnegative(),
  stickerLabel: z.coerce.number().nonnegative(),
  paperLabel: z.coerce.number().nonnegative(),
  delivery: z.coerce.number().nonnegative(),
});

export type PricesSchema = z.output<typeof pricesSchema>;
