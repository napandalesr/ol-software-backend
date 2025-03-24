/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Businessman` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Businessman_email_key" ON "Businessman"("email");
