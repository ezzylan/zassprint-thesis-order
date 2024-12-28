import { serverSupabaseClient } from "#supabase/server";
import { useDateFormat } from "@vueuse/core";
import { PDFDocument } from "pdf-lib";
import { Database } from "~~/types/database.types";

export default defineEventHandler(async (event) => {
  const orderNo = getRouterParam(event, "orderNo") as string;

  const client = await serverSupabaseClient<Database>(event);

  const { data: thesisOrders } = await client
    .from("thesis_orders")
    .select()
    .eq("order_no", orderNo);

  const thesisOrder = thesisOrders?.[0] ?? {
    address: null,
    black_white_pages: 0,
    cd_copies: null,
    cd_label: null,
    collection_date: "",
    collection_method: "",
    color_pages: 0,
    copies: 0,
    cover_color: "",
    created_at: "",
    faculty: "",
    id: 0,
    matrix_num: "",
    name: "",
    order_no: "",
    phone_num: "",
    status: "",
    study_acronym: "",
    thesis_title: "",
    thesis_type: "",
    year: 0,
  };

  const receiptFile = await useStorage("assets:server").getItemRaw(
    "thesis-order-receipt-template.pdf",
  );

  const receipt = await PDFDocument.load(receiptFile);
  const page = receipt.getPage(0);
  const { width, height } = page.getSize();

  const createdAt = useDateFormat(thesisOrder.created_at, "DD/MM/YYYY");

  page.drawText(createdAt.value, {
    x: 98,
    y: height / 2 + 319,
    size: 12,
  });

  // receipt no
  page.drawText(thesisOrder.order_no, {
    x: width - 193,
    y: height / 2 + 319,
    size: 12,
  });

  // name
  page.drawText(thesisOrder.name, {
    x: 105,
    y: height / 2 + 246,
    size: 12,
  });
  // phone no
  page.drawText(thesisOrder.phone_num, {
    x: width - 185,
    y: height / 2 + 245,
    size: 12,
  });

  const { data: prices } = await client.from("prices").select("name, amount");

  // printing color
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 158,
    size: 12,
  });
  // no of pages
  page.drawText(thesisOrder.color_pages.toString(), {
    x: 330,
    y: height / 2 + 158,
    size: 12,
  });
  // price
  const colorPrice = prices?.find((price) => price.name === "color")?.amount || 1.5;
  page.drawText(colorPrice.toFixed(2), {
    x: width - 183,
    y: height / 2 + 158,
    size: 12,
  });
  // total price
  const totalColorPrice =
    thesisOrder.copies * thesisOrder.color_pages * colorPrice;
  page.drawText(totalColorPrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 158,
    size: 12,
  });

  // printing black & white
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 138,
    size: 12,
  });
  // no of pages
  page.drawText(thesisOrder.black_white_pages.toString(), {
    x: 327,
    y: height / 2 + 138,
    size: 12,
  });
  // price
  const blackWhitePrice = prices?.find((price) => price.name === "blackWhite")?.amount || 0.15;
  page.drawText(blackWhitePrice.toFixed(2), {
    x: width - 183,
    y: height / 2 + 138,
    size: 12,
  });
  // total price
  const totalBlackWhitePrice =
    thesisOrder.copies * thesisOrder.black_white_pages * blackWhitePrice;
  page.drawText(totalBlackWhitePrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 138,
    size: 12,
  });

  // thesis hard/soft cover
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 118,
    size: 12,
  });
  // price
  const coverPrice = prices?.find((price) => price.name === "hardSoftBinding")?.amount || 25;
  page.drawText(coverPrice.toFixed(2), {
    x: width - 185,
    y: height / 2 + 118,
    size: 12,
  });
  // total price
  const totalCoverPrice = thesisOrder.copies * coverPrice;
  page.drawText(totalCoverPrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 118,
    size: 12,
  });

  // cd burn & label
  let labelPrice,
    totalLabelPrice = 0;
  if (thesisOrder.cd_copies) {
    // quantity
    page.drawText(thesisOrder.cd_copies.toString(), {
      x: 276,
      y: height / 2 + 78,
      size: 12,
    });

    const stickerLabelPrice = prices?.find((price) => price.name === "stickerLabel")?.amount || 10;
    const paperLabelPrice = prices?.find((price) => price.name === "paperLabel")?.amount || 5;

    if (thesisOrder.cd_label === "Sticker Label") {
      labelPrice = stickerLabelPrice;
      totalLabelPrice = thesisOrder.cd_copies * stickerLabelPrice;
    } else {
      labelPrice = paperLabelPrice;
      totalLabelPrice = thesisOrder.cd_copies * paperLabelPrice;
    }

    // price
    page.drawText(labelPrice.toFixed(2), {
      x: width - 185,
      y: height / 2 + 78,
      size: 12,
    });
    // total price
    page.drawText(totalLabelPrice.toFixed(2), {
      x: width - 89,
      y: height / 2 + 78,
      size: 12,
    });
  }

  // shipping price
  let shippingPrice = 0;
  if (thesisOrder.collection_method === "Delivery") {
    shippingPrice = prices?.find((price) => price.name === "delivery")?.amount as number;
    // price
    page.drawText(shippingPrice.toFixed(2), {
      x: width - 185,
      y: height / 2 + 53,
      size: 12,
    });
    // total price
    page.drawText(shippingPrice.toFixed(2), {
      x: width - 89,
      y: height / 2 + 53,
      size: 12,
    });
  }

  // total overall
  let totalOverallPrice =
    totalColorPrice +
    totalBlackWhitePrice +
    totalCoverPrice +
    totalLabelPrice +
    shippingPrice;
  page.drawText(totalOverallPrice.toFixed(2), {
    x: width - 93,
    y: 337,
    size: 12,
  });
  // deposit
  const deposit = Math.trunc(totalOverallPrice / 2);
  page.drawText(deposit.toFixed(2), {
    x: width - 93,
    y: 314,
    size: 12,
  });
  // balance
  page.drawText((totalOverallPrice - deposit).toFixed(2), {
    x: width - 93,
    y: 293,
    size: 12,
  });

  const pdfBytes = await receipt.save();

  setHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Length": pdfBytes.byteLength.toString(),
    "Content-Disposition": `inline; filename="receipt-${thesisOrder.order_no}.pdf"`,
  });

  return pdfBytes;
});
