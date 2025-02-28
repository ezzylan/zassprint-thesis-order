import { pricesSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    pricesSchema.parse(body),
  );

  await Promise.all([
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.blackWhite })
      .where(eq(tables.prices.name, "blackWhite")),
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.color })
      .where(eq(tables.prices.name, "color")),
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.binding })
      .where(eq(tables.prices.name, "hardSoftBinding")),
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.stickerLabel })
      .where(eq(tables.prices.name, "stickerLabel")),
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.paperLabel })
      .where(eq(tables.prices.name, "paperLabel")),
    await useDrizzle()
      .update(tables.prices)
      .set({ amount: result.delivery })
      .where(eq(tables.prices.name, "delivery")),
  ]);
});
