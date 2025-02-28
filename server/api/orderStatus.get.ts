import { orderStatusSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  const { orderNo } = await getValidatedQuery(event, (query) =>
    orderStatusSchema.parse(query),
  );

  const data = await useDrizzle()
    .select({ status: tables.thesisOrders.status })
    .from(tables.thesisOrders)
    .where(eq(tables.thesisOrders.orderNo, orderNo))
    .limit(1);

  return data[0].status;
});
