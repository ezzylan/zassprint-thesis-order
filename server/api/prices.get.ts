export default defineEventHandler(async () => {
  return await useDrizzle()
    .select({ name: tables.prices.name, amount: tables.prices.amount })
    .from(tables.prices);
});
