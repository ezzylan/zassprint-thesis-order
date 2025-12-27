export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const result = await readValidatedBody(event, pricesSchema.parse);

  await Promise.all([
    await db
      .update(tables.prices)
      .set({ amount: result.blackWhite })
      .where(eq(tables.prices.name, "blackWhite")),
    await db
      .update(tables.prices)
      .set({ amount: result.color })
      .where(eq(tables.prices.name, "color")),
    await db
      .update(tables.prices)
      .set({ amount: result.binding })
      .where(eq(tables.prices.name, "hardSoftBinding")),
    await db
      .update(tables.prices)
      .set({ amount: result.stickerLabel })
      .where(eq(tables.prices.name, "stickerLabel")),
    await db
      .update(tables.prices)
      .set({ amount: result.paperLabel })
      .where(eq(tables.prices.name, "paperLabel")),
    await db
      .update(tables.prices)
      .set({ amount: result.delivery })
      .where(eq(tables.prices.name, "delivery")),
  ]);
});
