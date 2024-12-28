import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~~/types/database.types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client
    .from("thesis_orders")
    .select("*")
    .order("order_no", { ascending: false });

  return data ?? [];
});
