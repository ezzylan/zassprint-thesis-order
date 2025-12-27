import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../database/schema";

export { and, desc, eq, gte, lt } from "drizzle-orm";

export const tables = schema;

const { databaseUrl } = useRuntimeConfig();

export const db = drizzle({ client: neon(databaseUrl) });

export type InsertThesisOrder = typeof schema.thesisOrders.$inferInsert;
export type PostThesisOrder = Omit<InsertThesisOrder, "orderNo">;
export type SelectThesisOrder = typeof schema.thesisOrders.$inferSelect;
