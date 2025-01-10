-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" CITEXT NOT NULL,
    "twitterId" TEXT,
    "twitterName" TEXT,
    "discordId" TEXT,
    "discordName" TEXT,
    "cex" TEXT,
    "cexId" TEXT,
    "cexWalletAddress" CITEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");
