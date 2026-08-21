import path from "path";
import prisma from "../prisma/client.js";

import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { queryBuilder } from "./query.service.js";
import {
  validateUploadedFile,
  moveFile,
  deleteFile,
  deleteUploadedFile,
} from "./file.service.js";
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
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,

      "Certificate not found",
    );
  }

  return certificate;
}

export async function createCertificate(data, files) {
  const image = files?.["image"]?.[0] ?? null;
  let imagename;
  let moved;
  try {
    const certificateId = crypto.randomUUID();

    if (image) {
      await validateUploadedFile(image, UPLOAD.IMAGE_TYPES);
      imagename = certificateId + path.extname(image.filename);
      data.image = `/${UPLOAD.DESTINATIONS.CERTIFICATES}/${imagename}`;
      moved = await moveFile(
        image.path,
        path.join(
          UPLOAD.BASE_DIRECTORY,
          UPLOAD.DESTINATIONS.CERTIFICATES,
          imagename,
        ),
      );
    }

    const certificate = await prisma.certificate.create({
      data: {
        id: certificateId,
        ...data,
      },
    });

    return certificate;
  } catch (error) {
    if (moved) {
      await deleteFile(
        path.join(
          UPLOAD.BASE_DIRECTORY,
          UPLOAD.DESTINATIONS.CERTIFICATES,
          imagename,
        ),
      );
    }
    throw error;
  }
}

export async function updateCertificate(data, certificateId, files) {
  const image = files?.["image"]?.[0] ?? null;
  let imagename;
  let moved;
  let movedPath;
  try {
    if (image) {
      await validateUploadedFile(image, UPLOAD.IMAGE_TYPES);
      imagename = certificateId + path.extname(image.filename);
      data.image = `/${UPLOAD.DESTINATIONS.CERTIFICATES}/${imagename}`;
    }

    const current = await getCertificate(certificateId);

    if (data.image) {
      if (current.image) {
        await deleteUploadedFile(current.image);
      }
      movedPath = path.join(
        UPLOAD.BASE_DIRECTORY,
        UPLOAD.DESTINATIONS.CERTIFICATES,
        imagename,
      );

      moved = await moveFile(image.path, movedPath);
    }

    const update = await prisma.certificate.update({
      where: {
        id: certificateId,
      },
      data,
    });

    return update;
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Certificate not found");
    }
    if (moved) {
      deleteFile(movedPath);
    }
    throw error;
  }
}

export async function deleteCertificate(certificateId) {
  try {
    const certificate = await getCertificate(certificateId);

    if (certificate.image) {
      await deleteUploadedFile(certificate.image);
    }
    return await prisma.certificate.delete({
      where: {
        id: certificateId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Certificate not found");
    }

    throw error;
  }
}
