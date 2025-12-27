import { useDateFormat } from "@vueuse/core";
import { PDFDocument } from "pdf-lib";

const FONT_SIZE = 12;

export default defineEventHandler(async (event) => {
  const { orderNo } = await getValidatedRouterParams(
    event,
    getOrderStatusSchema.parse,
  );

  const thesisOrders = await db
    .select()
    .from(tables.thesisOrders)
    .where(eq(tables.thesisOrders.orderNo, orderNo));

  const thesisOrder = thesisOrders[0];

  const receiptFile = await useStorage("assets:server").getItemRaw(
    "thesis-order-receipt-template.pdf",
  );

  const receipt = await PDFDocument.load(receiptFile);
  const page = receipt.getPage(0);
  const { width, height } = page.getSize();

  const createdAt = useDateFormat(thesisOrder.createdAt, "DD/MM/YYYY");

  page.drawText(createdAt.value, {
    x: 98,
    y: height / 2 + 319,
    size: FONT_SIZE,
  });

  // receipt no
  page.drawText(thesisOrder.orderNo, {
    x: width - 193,
    y: height / 2 + 319,
    size: FONT_SIZE,
  });

  // name
  page.drawText(thesisOrder.name, {
    x: 105,
    y: height / 2 + 246,
    size: FONT_SIZE,
  });
  // phone no
  page.drawText(thesisOrder.phoneNumber, {
    x: width - 185,
    y: height / 2 + 245,
    size: FONT_SIZE,
  });

  // printing color
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 158,
    size: FONT_SIZE,
  });
  // no of pages
  page.drawText(thesisOrder.colorPages.toString(), {
    x: 330,
    y: height / 2 + 158,
    size: FONT_SIZE,
  });
  // price
  const colorPrice = (await getPrice("color")) || 1.5;
  page.drawText(colorPrice.toFixed(2), {
    x: width - 183,
    y: height / 2 + 158,
    size: FONT_SIZE,
  });
  // total price
  const totalColorPrice =
    thesisOrder.copies * thesisOrder.colorPages * colorPrice;
  page.drawText(totalColorPrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 158,
    size: FONT_SIZE,
  });

  // printing black & white
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 138,
    size: FONT_SIZE,
  });
  // no of pages
  page.drawText(thesisOrder.blackWhitePages.toString(), {
    x: 327,
    y: height / 2 + 138,
    size: FONT_SIZE,
  });
  // price
  const blackWhitePrice = (await getPrice("blackWhite")) || 0.15;
  page.drawText(blackWhitePrice.toFixed(2), {
    x: width - 183,
    y: height / 2 + 138,
    size: FONT_SIZE,
  });
  // total price
  const totalBlackWhitePrice =
    thesisOrder.copies * thesisOrder.blackWhitePages * blackWhitePrice;
  page.drawText(totalBlackWhitePrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 138,
    size: FONT_SIZE,
  });

  // thesis hard/soft cover
  // quantity
  page.drawText(thesisOrder.copies.toString(), {
    x: 276,
    y: height / 2 + 118,
    size: FONT_SIZE,
  });
  // price
  const coverPrice = (await getPrice("hardSoftBinding")) || 25;
  page.drawText(coverPrice.toFixed(2), {
    x: width - 185,
    y: height / 2 + 118,
    size: FONT_SIZE,
  });
  // total price
  const totalCoverPrice = thesisOrder.copies * coverPrice;
  page.drawText(totalCoverPrice.toFixed(2), {
    x: width - 93,
    y: height / 2 + 118,
    size: FONT_SIZE,
  });

  // cd burn & label
  let labelPrice,
    totalLabelPrice = 0;
  if (thesisOrder.cdCopies) {
    // quantity
    page.drawText(thesisOrder.cdCopies.toString(), {
      x: 276,
      y: height / 2 + 78,
      size: FONT_SIZE,
    });

    const stickerLabelPrice = (await getPrice("stickerLabel")) || 10;
    const paperLabelPrice = (await getPrice("paperLabel")) || 5;

    if (thesisOrder.cdLabel === "Sticker Label") {
      labelPrice = stickerLabelPrice;
      totalLabelPrice = thesisOrder.cdCopies * stickerLabelPrice;
    } else {
      labelPrice = paperLabelPrice;
      totalLabelPrice = thesisOrder.cdCopies * paperLabelPrice;
    }

    // price
    page.drawText(labelPrice.toFixed(2), {
      x: width - 185,
      y: height / 2 + 78,
      size: FONT_SIZE,
    });
    // total price
    page.drawText(totalLabelPrice.toFixed(2), {
      x: width - 89,
      y: height / 2 + 78,
      size: FONT_SIZE,
    });
  }

  // shipping price
  let shippingPrice = 0;
  if (thesisOrder.collectionMethod === "Delivery") {
    shippingPrice = (await getPrice("delivery")) as number;
    // price
    page.drawText(shippingPrice.toFixed(2), {
      x: width - 185,
      y: height / 2 + 53,
      size: FONT_SIZE,
    });
    // total price
    page.drawText(shippingPrice.toFixed(2), {
      x: width - 89,
      y: height / 2 + 53,
      size: FONT_SIZE,
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
    size: FONT_SIZE,
  });
  // deposit
  const deposit = Math.trunc(totalOverallPrice / 2);
  page.drawText(deposit.toFixed(2), {
    x: width - 93,
    y: 314,
    size: FONT_SIZE,
  });
  // balance
  page.drawText((totalOverallPrice - deposit).toFixed(2), {
    x: width - 93,
    y: 293,
    size: FONT_SIZE,
  });

  const pdfBytes = await receipt.save();

  setHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Length": pdfBytes.byteLength.toString(),
    "Content-Disposition": `inline; filename="receipt-${thesisOrder.orderNo}.pdf"`,
  });

  return pdfBytes;
});
