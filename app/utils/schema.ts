import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export const thesisOrderSchema = z.object({
  name: z.string(),
  phone_num: z.string().min(10),
  thesis_type: z.string({ required_error: "Please select a thesis type" }),
  cover_color: z.string({ required_error: "Please select a cover color" }),
  thesis_title: z.string(),
  faculty: z.string(),
  year: z.coerce.number().int().gte(2025).lte(2099),
  study_acronym: z.string(),
  matrix_num: z.string().min(8),
  color_pages: z.coerce.number().int().nonnegative(),
  black_white_pages: z.coerce.number().int().nonnegative(),
  copies: z.coerce.number().int().positive().default(1),
  cd_burn: z.boolean().default(false),
  cd_label: z.string().optional(),
  cd_copies: z.coerce.number().int().nonnegative().optional(),
  collection_date: z.coerce
    .date()
    .refine((v) => v, { message: "Please select a collection date." }),
  collection_method: z.string({
    required_error: "Please select a collection method",
  }),
  address: z.string().optional(),
});

export const orderStatusSchema = z.object({
  orderNo: z.string().length(7),
});

export const pricesSchema = z.object({
  blackWhite: z.coerce.number(),
  color: z.coerce.number(),
  binding: z.coerce.number(),
  stickerLabel: z.coerce.number(),
  paperLabel: z.coerce.number(),
  delivery: z.coerce.number(),
});
