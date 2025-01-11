import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  walletAddress: text("walletAddress").unique(),
  twitterId: text("twitterId"),
  twitterName: text("twitterName"),
  discordId: text("discordId"),
  discordName: text("discordName"),
  cex: text("cex"),
  cexId: text("cexId"),
  cexWalletAddress: text("cexWalletAddress"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
