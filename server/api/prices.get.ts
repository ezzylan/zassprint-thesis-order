export default defineEventHandler(async () => {
  return await db
    .select({ name: tables.prices.name, amount: tables.prices.amount })
    .from(tables.prices);
});
