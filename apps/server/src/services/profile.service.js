import crypto from "crypto";
import prisma from "../prisma/client.js";

import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { uploadFile, deleteCloudinaryFile } from "./cloudinary.service.js";
import { UPLOAD } from "../config/upload.config.js";

export async function getProfile() {
  const profile = await prisma.profile.findUnique({
    where: {
      id: "main-profile",
    },
  });

  if (!profile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Profile not found");
  }

  return profile;
}

function getUploadedFile(files, field) {
  return files?.[field]?.[0] ?? null;
}

export async function updateProfile(data, files) {
  const profileImage = getUploadedFile(files, "profileImage");
  const resume = getUploadedFile(files, "resume");
  const cv = getUploadedFile(files, "cv");

  const uploadedFiles = [];

  try {
    const current = await getProfile();

    if (profileImage) {
      const publicId = `main-profile/${crypto.randomUUID()}`;

      const result = await uploadFile(
        profileImage,
        UPLOAD.DESTINATIONS.PROFILE,
        publicId,
      );

      uploadedFiles.push({
        publicId: result.public_id,
        resourceType: result.resource_type,
      });

      data.profileImage = result.secure_url;
      data.profileImagePublicId = result.public_id;
      data.profileImageResourceType = result.resource_type;
    }

    if (resume) {
      const publicId = `main-profile/${crypto.randomUUID()}`;

      const result = await uploadFile(
        resume,
        UPLOAD.DESTINATIONS.RESUME,
        publicId,
      );

      uploadedFiles.push({
        publicId: result.public_id,
        resourceType: result.resource_type,
      });

      data.resumeUrl = result.secure_url;
      data.resumePublicId = result.public_id;
      data.resumeResourceType = result.resource_type;
    }

    if (cv) {
      const publicId = `main-profile/${crypto.randomUUID()}`;

      const result = await uploadFile(cv, UPLOAD.DESTINATIONS.CV, publicId);

      uploadedFiles.push({
        publicId: result.public_id,
        resourceType: result.resource_type,
      });

      data.cvUrl = result.secure_url;
      data.cvPublicId = result.public_id;
      data.cvResourceType = result.resource_type;
    }

    const update = await prisma.profile.update({
      where: {
        id: "main-profile",
      },
      data,
    });

    if (profileImage && current.profileImagePublicId) {
      await deleteCloudinaryFile(
        current.profileImagePublicId,
        current.profileImageResourceType,
      );
    }

    if (resume && current.resumePublicId) {
      await deleteCloudinaryFile(
        current.resumePublicId,
        current.resumeResourceType,
      );
    }

    if (cv && current.cvPublicId) {
      await deleteCloudinaryFile(current.cvPublicId, current.cvResourceType);
    }

    return update;
  } catch (error) {
    for (const file of uploadedFiles) {
      await deleteCloudinaryFile(file.publicId, file.resourceType);
    }

    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Profile not found");
    }

    throw error;
  }
}
