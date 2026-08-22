import crypto from "crypto";
import prisma from "../prisma/client.js";

import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { queryBuilder } from "./query.service.js";
import { uploadFile, deleteCloudinaryFile } from "./cloudinary.service.js";
import { UPLOAD } from "../config/upload.config.js";

export async function getAllCertificates(query) {
  const where = {};

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },

      {
        issuer: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return queryBuilder({
    model: prisma.certificate,
    query,
    where,
    allowedSortFields: ["name", "issuer", "createdAt", "issueDate"],
    defaultSort: [{ name: "asc" }, { issueDate: "desc" }],
  });
}

export async function getCertificate(id) {
  const certificate = await prisma.certificate.findUnique({
    where: { id },
  });

  if (!certificate) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Certificate not found");
  }

  return certificate;
}

export async function createCertificate(data, files) {
  const image = files?.["image"]?.[0] ?? null;

  let uploadedFile = null;

  try {
    const certificateId = crypto.randomUUID();

    if (image) {
      const publicId = `${certificateId}/${crypto.randomUUID()}`;

      const result = await uploadFile(
        image,
        UPLOAD.DESTINATIONS.CERTIFICATES,
        publicId,
      );

      uploadedFile = {
        publicId: result.public_id,
        resourceType: result.resource_type,
      };

      data.image = result.secure_url;
      data.publicId = result.public_id;
      data.resourceType = result.resource_type;
    }

    return await prisma.certificate.create({
      data: {
        id: certificateId,
        ...data,
      },
    });
  } catch (error) {
    if (uploadedFile) {
      await deleteCloudinaryFile(
        uploadedFile.publicId,
        uploadedFile.resourceType,
      );
    }

    throw error;
  }
}

export async function updateCertificate(data, certificateId, files) {
  const image = files?.["image"]?.[0] ?? null;

  let uploadedFile = null;

  try {
    const current = await getCertificate(certificateId);

    if (image) {
      const publicId = `${certificateId}/${crypto.randomUUID()}`;

      const result = await uploadFile(
        image,
        UPLOAD.DESTINATIONS.CERTIFICATES,
        publicId,
      );

      uploadedFile = {
        publicId: result.public_id,
        resourceType: result.resource_type,
      };

      data.image = result.secure_url;
      data.publicId = result.public_id;
      data.resourceType = result.resource_type;
    }

    const update = await prisma.certificate.update({
      where: {
        id: certificateId,
      },
      data,
    });

    // Delete the old Cloudinary file only after the database
    // update succeeds.
    if (image && current.publicId) {
      await deleteCloudinaryFile(current.publicId, current.resourceType);
    }

    return update;
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Certificate not found");
    }

    if (uploadedFile) {
      await deleteCloudinaryFile(
        uploadedFile.publicId,
        uploadedFile.resourceType,
      );
    }

    throw error;
  }
}

export async function deleteCertificate(certificateId) {
  try {
    const certificate = await getCertificate(certificateId);

    const deleted = await prisma.certificate.delete({
      where: {
        id: certificateId,
      },
    });

    if (certificate.publicId) {
      await deleteCloudinaryFile(
        certificate.publicId,
        certificate.resourceType,
      );
    }

    return deleted;
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Certificate not found");
    }

    throw error;
  }
}
