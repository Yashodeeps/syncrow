/*
  Warnings:

  - You are about to drop the `Escrow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Escrow" DROP CONSTRAINT "Escrow_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_Participant" DROP CONSTRAINT "_Participant_A_fkey";

-- DropForeignKey
ALTER TABLE "_Participant" DROP CONSTRAINT "_Participant_B_fkey";

-- DropTable
DROP TABLE "Escrow";

-- DropTable
DROP TABLE "_Participant";

-- DropEnum
DROP TYPE "EscrowStatus";

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "reviewer_address" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_reviewer_address_key" ON "Reviews"("reviewer_address");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
