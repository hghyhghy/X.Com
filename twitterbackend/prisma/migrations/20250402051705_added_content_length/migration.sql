/*
  Warnings:

  - You are about to alter the column `content` on the `post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `content` VARCHAR(191) NOT NULL;
