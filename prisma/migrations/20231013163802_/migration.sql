/*
  Warnings:

  - You are about to drop the column `movieId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `isBookmarked` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `trending` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_movieId_fkey";

-- DropIndex
DROP INDEX "Category_movieId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "movieId";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "isBookmarked",
DROP COLUMN "trending",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ThumbNail" ALTER COLUMN "small" DROP NOT NULL,
ALTER COLUMN "small" DROP DEFAULT,
ALTER COLUMN "medium" DROP NOT NULL,
ALTER COLUMN "medium" DROP DEFAULT,
ALTER COLUMN "large" DROP NOT NULL,
ALTER COLUMN "large" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
