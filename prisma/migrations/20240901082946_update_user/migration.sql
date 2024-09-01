-- CreateEnum
CREATE TYPE "Account" AS ENUM ('FREELANCER', 'CLIENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account" "Account" NOT NULL DEFAULT 'FREELANCER';
