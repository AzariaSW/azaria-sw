-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "resourceType" TEXT NOT NULL DEFAULT 'image';
