export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const { orderNo } = await readValidatedBody(
    event,
    getOrderStatusSchema.parse,
  );

  await db
    .delete(tables.thesisOrders)
    .where(eq(tables.thesisOrders.orderNo, orderNo));
});
