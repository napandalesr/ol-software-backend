-- CreateTable
CREATE TABLE "Municipality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_name_key" ON "Municipality"("name");
