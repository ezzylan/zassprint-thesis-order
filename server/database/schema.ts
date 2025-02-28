import {
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const thesisOrders = pgTable("thesis_orders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: varchar("phone_num").notNull(),
  thesisType: text("thesis_type").notNull(),
  coverColor: text("cover_color").notNull(),
  thesisTitle: text("thesis_title").notNull(),
  faculty: text("faculty").notNull(),
  year: integer("year").notNull(),
  studyAcronym: varchar("study_acronym").notNull(),
  matrixNumber: varchar("matrix_num").notNull(),
  colorPages: integer("color_pages").notNull().default(0),
  blackWhitePages: integer("black_white_pages").notNull().default(1),
  copies: integer("copies").notNull().default(1),
  cdLabel: text("cd_label"),
  cdCopies: integer("cd_copies"),
  collectionDate: date("collection_date").notNull(),
  collectionMethod: text("collection_method"),
  address: text("address"),
  status: text("status").notNull().default("pending"),
  orderNo: varchar("order_no").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
