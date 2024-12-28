import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~~/types/database.types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);

  await client.from("thesis_orders").delete().eq("order_no", body.orderNo);
});
