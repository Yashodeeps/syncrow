-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_id_fkey";

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
