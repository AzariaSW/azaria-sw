-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "resourceType" TEXT NOT NULL DEFAULT 'image';
