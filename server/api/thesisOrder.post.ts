import { serverSupabaseClient } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useDateFormat, useNow } from "@vueuse/core";
import { capitalCase } from "change-case";
import { addMonths } from "date-fns";
import { z } from "zod";
import { thesisOrderSchema } from "~/utils/schema";
import { Database } from "~~/types/database.types";

const now = useNow();

const countExistingOrders = async (client: SupabaseClient<Database>) => {
  const { data } = await client
    .from("thesis_orders")
    .select("order_no")
    .order("order_no", { ascending: true })
    .gte("created_at", `${useDateFormat(now, "YYYY-MM").value}-01`)
    .lt(
      "created_at",
      `${useDateFormat(addMonths(now.value, 1), "YYYY-MM").value}-01`,
  );

  return data?.length === 0
    ? `${useDateFormat(now, "YYMM")}001`
    : (Number(data?.pop()?.order_no) + 1).toString();
};

const insertDatabase = async (
  client: SupabaseClient<Database>,
  data: z.output<typeof thesisOrderSchema>,
  orderNo: string,
) => {
  await client.from("thesis_orders").insert({
    name: capitalCase(data.name),
    phone_num: data.phone_num,
    matrix_num: data.matrix_num,
    thesis_type: data.thesis_type,
    cover_color: data.cover_color,
    thesis_title: data.thesis_title,
    faculty: data.faculty,
    year: data.year,
    study_acronym: data.study_acronym,
    color_pages: data.color_pages,
    black_white_pages: data.black_white_pages,
    copies: data.copies,
    cd_label: data.cd_label,
    cd_copies: data.cd_copies,
    collection_date: data.collection_date.toISOString(),
    collection_method: data.collection_method,
    address: data.address,
    order_no: orderNo,
  });
};

const { telegramBotApiToken } = useRuntimeConfig();

const sendTeleBotAlert = async (orderNo: string, name: string) => {
  let bodyContent = new FormData();
  bodyContent.append("chat_id", "@zassprintkps");
  bodyContent.append(
    "text",
    `New thesis order received: #${orderNo}
		${capitalCase(name)}`,
  );

  try {
    await $fetch(
      `https://api.telegram.org/bot${telegramBotApiToken}/sendMessage`,
      {
        method: "POST",
        body: bodyContent,
      },
    );
  } catch (error) {
    console.error("Error sending Telegram alert:", error);
  }
};

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    thesisOrderSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const client = await serverSupabaseClient<Database>(event);
  const orderNo = await countExistingOrders(client);

  await insertDatabase(client, result.data, orderNo);
  await sendTeleBotAlert(orderNo, result.data.name);

  return orderNo;
});
