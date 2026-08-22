-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cvPublicId" TEXT,
ADD COLUMN     "cvResourceType" TEXT NOT NULL DEFAULT 'raw',
ADD COLUMN     "profileImagePublicId" TEXT,
ADD COLUMN     "profileImageResourceType" TEXT NOT NULL DEFAULT 'image',
ADD COLUMN     "resumePublicId" TEXT,
ADD COLUMN     "resumeResourceType" TEXT NOT NULL DEFAULT 'raw';
