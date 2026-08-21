import prisma from "../prisma/client.js";

import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { validateUploadedFile, deleteFile, deleteUploadedFile } from "./file.service.js";
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
  let updated = false;
  try {
    if (profileImage) {
      await validateUploadedFile(profileImage, UPLOAD.IMAGE_TYPES);
      data.profileImage = `/${UPLOAD.DESTINATIONS.PROFILE}/${profileImage.filename}`;
    }

    if (resume) {
      await validateUploadedFile(resume, UPLOAD.DOCUMENT_TYPES);
      data.resumeUrl = `/${UPLOAD.DESTINATIONS.RESUME}/${resume.filename}`;
    }

    if (cv) {
      await validateUploadedFile(cv, UPLOAD.DOCUMENT_TYPES);
      data.cvUrl = `/${UPLOAD.DESTINATIONS.CV}/${cv.filename}`;
    }

    const current = await getProfile();

    const update = await prisma.profile.update({
      where: {
        id: "main-profile",
      },

      data,
    });

    updated = true;

    const uploadedFields = ["profileImage", "resumeUrl", "cvUrl"];

    for (const field of uploadedFields) {
      if (data[field] && current[field] && data[field] !== current[field]) {
        await deleteUploadedFile(current[field]);
      }
    }

    return update;
  } catch (error) {
    if (!updated) {
      await deleteFile(profileImage?.path);
      await deleteFile(resume?.path);
      await deleteFile(cv?.path);
    }

    throw error;
  }
}
