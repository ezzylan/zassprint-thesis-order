export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  await useDrizzle()
    .update(tables.thesisOrders)
    .set({ status: body.newStatus })
    .where(eq(tables.thesisOrders.orderNo, body.orderNo));
});
