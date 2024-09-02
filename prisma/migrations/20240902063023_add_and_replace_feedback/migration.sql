/*
  Warnings:

  - You are about to drop the column `review` on the `Reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "review",
ADD COLUMN     "feedback" TEXT;
