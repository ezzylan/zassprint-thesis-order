import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema";

export { and, desc, eq, gte, lt } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  const client = postgres(process.env.DATABASE_URL!);
  return drizzle({ client });
}

export type InsertThesisOrder = typeof schema.thesisOrders.$inferInsert;
export type SelectThesisOrder = typeof schema.thesisOrders.$inferSelect;
export type SelectPrice = typeof schema.prices.$inferSelect;
