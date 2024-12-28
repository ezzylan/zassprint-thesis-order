import { serverSupabaseClient } from "#supabase/server";
import { pricesSchema } from "~/utils/schema";
import { Database } from "~~/types/database.types";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    pricesSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const client = await serverSupabaseClient<Database>(event);

  await Promise.all([
    client
      .from("prices")
      .update({ amount: result.data.blackWhite })
      .eq("name", "blackWhite"),
    client
      .from("prices")
      .update({ amount: result.data.color })
      .eq("name", "color"),
    client
      .from("prices")
      .update({ amount: result.data.binding })
      .eq("name", "hardSoftBinding"),
    client
      .from("prices")
      .update({ amount: result.data.stickerLabel })
      .eq("name", "stickerLabel"),
    client
      .from("prices")
      .update({ amount: result.data.paperLabel })
      .eq("name", "paperLabel"),
    client
      .from("prices")
      .update({ amount: result.data.delivery })
      .eq("name", "delivery"),
  ]);
});
