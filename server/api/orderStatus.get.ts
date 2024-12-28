import { serverSupabaseClient } from "#supabase/server";
import { orderStatusSchema } from "~/utils/schema";
import { Database } from "~~/types/database.types";

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, (query) =>
    orderStatusSchema.safeParse(query),
  );

  if (!result.success) throw result.error.issues;

  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client
    .from("thesis_orders")
    .select("status")
    .eq("order_no", result.data.orderNo);

  return data ? data[0].status : null;
});
