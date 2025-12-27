export default defineEventHandler(async (event) => {
  const { orderNo } = await getValidatedQuery(
    event,
    getOrderStatusSchema.parse,
  );

  const data = await db
    .select({ status: tables.thesisOrders.status })
    .from(tables.thesisOrders)
    .where(eq(tables.thesisOrders.orderNo, String(orderNo)))
    .limit(1);

  return data[0].status;
});
