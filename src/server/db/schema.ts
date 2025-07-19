import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const blogsTable = sqliteTable("blogs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date"),
  description: text("date"),
  tags: text("tags")
});
