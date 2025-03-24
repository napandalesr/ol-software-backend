-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Statuses" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Businessman" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "status" "Statuses" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user" INTEGER NOT NULL,

    CONSTRAINT "Businessman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establishment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "employees" INTEGER NOT NULL,
    "businessmanId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user" INTEGER NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Businessman" ADD CONSTRAINT "Businessman_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_businessmanId_fkey" FOREIGN KEY ("businessmanId") REFERENCES "Businessman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
