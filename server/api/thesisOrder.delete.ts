export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const body = await readBody(event);

  await useDrizzle()
    .delete(tables.thesisOrders)
    .where(eq(tables.thesisOrders.orderNo, body.orderNo));
});
