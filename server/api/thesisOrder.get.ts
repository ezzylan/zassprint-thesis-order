export default defineEventHandler(async () => {
  return await db
    .select()
    .from(tables.thesisOrders)
    .orderBy(desc(tables.thesisOrders.orderNo));
});
