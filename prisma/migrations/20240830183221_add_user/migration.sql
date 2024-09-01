/*
  Warnings:

  - Added the required column `user_id` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "user_id" TEXT NOT NULL;
