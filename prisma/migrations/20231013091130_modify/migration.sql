/*
  Warnings:

  - Added the required column `recommended` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trending` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ThumbNail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "recommended" BOOLEAN NOT NULL,
ADD COLUMN     "trending" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ThumbNail" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "BookMark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,

    CONSTRAINT "BookMark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
