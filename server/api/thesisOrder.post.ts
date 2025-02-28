import { useDateFormat, useNow } from "@vueuse/core";
import { capitalCase } from "change-case";
import { addMonths } from "date-fns";
import { z } from "zod";
import { thesisOrderSchema } from "~/utils/schema";

const now = useNow();

const countExistingOrders = async () => {
  const thisMonth = useDateFormat(now, "YYYY-MM").value;
  const nextMonth = useDateFormat(addMonths(now.value, 1), "YYYY-MM").value;

  const data = await useDrizzle()
    .select({ order_no: tables.thesisOrders.orderNo })
    .from(tables.thesisOrders)
    .orderBy(tables.thesisOrders.createdAt)
    .where(
      and(
        gte(tables.thesisOrders.createdAt, new Date(thisMonth)),
        lt(tables.thesisOrders.createdAt, new Date(nextMonth)),
      ),
    );

  return data.length === 0
    ? `${useDateFormat(now, "YYMM").value}001`
    : (Number(data?.pop()?.order_no) + 1).toString();
};

const insertDatabase = async (
  data: z.output<typeof thesisOrderSchema>,
  orderNo: string,
) => {
  await useDrizzle()
    .insert(tables.thesisOrders)
    .values({
      name: capitalCase(data.name),
      phoneNumber: data.phoneNumber,
      matrixNumber: data.matrixNumber,
      thesisType: data.thesisType,
      coverColor: data.coverColor,
      thesisTitle: data.thesisTitle,
      faculty: data.faculty,
      year: data.year,
      studyAcronym: data.studyAcronym,
      colorPages: data.colorPages,
      blackWhitePages: data.blackWhitePages,
      copies: data.copies,
      cdLabel: data.cdLabel,
      cdCopies: data.cdCopies,
      collectionDate: data.collectionDate.toISOString(),
      collectionMethod: data.collectionMethod,
      address: data.address,
      orderNo: orderNo,
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
    thesisOrderSchema.parse(body),
  );

  const orderNo = await countExistingOrders();

  await insertDatabase(result, orderNo);
  await sendTeleBotAlert(orderNo, result.name);

  return orderNo;
});
