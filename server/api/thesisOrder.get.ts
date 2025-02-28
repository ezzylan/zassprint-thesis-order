export default defineEventHandler(async () => {
  return await useDrizzle()
    .select()
    .from(tables.thesisOrders)
    .orderBy(desc(tables.thesisOrders.orderNo));
});
