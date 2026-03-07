/*
  Warnings:

  - Added the required column `userId` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobDescription" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
