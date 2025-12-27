export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const { orderNo, status } = await readValidatedBody(
    event,
    updateOrderStatusSchema.parse,
  );

  await db
    .update(tables.thesisOrders)
    .set({ status })
    .where(eq(tables.thesisOrders.orderNo, orderNo));
});
