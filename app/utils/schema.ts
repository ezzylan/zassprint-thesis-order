import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export const thesisOrderSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().min(10),
  thesisType: z.string({ required_error: "Please select a thesis type" }),
  coverColor: z.string({ required_error: "Please select a cover color" }),
  thesisTitle: z.string(),
  faculty: z.string(),
  year: z.coerce.number().int().gte(2025),
  studyAcronym: z.string(),
  matrixNumber: z.string().min(8),
  colorPages: z.coerce.number().int().nonnegative(),
  blackWhitePages: z.coerce.number().int().nonnegative(),
  copies: z.coerce.number().int().positive().default(1),
  cdBurn: z.boolean().default(false),
  cdLabel: z.string().optional(),
  cdCopies: z.coerce.number().int().nonnegative().optional(),
  collectionDate: z.coerce
    .date()
    .refine((v) => v, { message: "Please select a collection date." }),
  collectionMethod: z.string({
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
