import crypto from "crypto";
import prisma from "../prisma/client.js";

import { queryBuilder } from "./query.service.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  uploadFile,
  deleteCloudinaryFile,
} from "./cloudinary.service.js";

import { UPLOAD } from "../config/upload.config.js";

const projectInclude = {
  images: {
    orderBy: {
      order: "asc",
    },
  },
};

export async function getAllProjects(query) {
  const where = {};

  if (query.featured === "true") {
    where.featured = true;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return queryBuilder({
    model: prisma.project,
    query,
    where,
    allowedSortFields: [
      "title",
      "description",
      "createdAt",
      "updatedAt",
      "featured",
    ],
    defaultSort: [{ createdAt: "desc" }],
  });
}

export async function getProject(id) {
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    include: projectInclude,
  });

  if (!project) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Project not found",
    );
  }

  return project;
}

export async function createProject(data, files) {
  const projectId = crypto.randomUUID();
  const uploadedFiles = [];

  try {
    const uploadedImages = [];

    for (const [index, file] of files.entries()) {
      const publicId = `${projectId}-${crypto.randomUUID()}`;

      const result = await uploadFile(
        file,
        UPLOAD.DESTINATIONS.PROJECTS,
        publicId,
      );

      uploadedFiles.push({
        publicId: result.public_id,
        resourceType: result.resource_type,
      });

      uploadedImages.push({
        projectId,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        order: index + 1,
      });
    }

    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          id: projectId,
          ...data,
        },
      });

      if (uploadedImages.length > 0) {
        await tx.projectImage.createMany({
          data: uploadedImages,
        });
      }

      return tx.project.findUnique({
        where: {
          id: projectId,
        },
        include: projectInclude,
      });
    });
  } catch (error) {
    for (const file of uploadedFiles) {
      await deleteCloudinaryFile(
        file.publicId,
        file.resourceType,
      );
    }

    throw error;
  }
}

export async function updateProject(data, projectId, files) {
  const {
    deletedImages = [],
    imageOrder = [],
    ...projectData
  } = data;

  const uploadedFiles = [];

  try {
    const currentProject = await getProject(projectId);

    const uploadedImages = [];

    for (const file of files) {
      const publicId = `${projectId}-${crypto.randomUUID()}`;

      const result = await uploadFile(
        file,
        UPLOAD.DESTINATIONS.PROJECTS,
        publicId,
      );

      uploadedFiles.push({
        publicId: result.public_id,
        resourceType: result.resource_type,
      });

      uploadedImages.push({
        projectId,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      });
    }

    const project = await prisma.$transaction(async (tx) => {
      if (deletedImages.length > 0) {
        await tx.projectImage.deleteMany({
          where: {
            id: {
              in: deletedImages,
            },
            projectId,
          },
        });
      }

      const lastImage = await tx.projectImage.findFirst({
        where: {
          projectId,
        },
        orderBy: {
          order: "desc",
        },
      });

      let nextOrder = lastImage
        ? lastImage.order + 1
        : 1;

      if (uploadedImages.length > 0) {
        await tx.projectImage.createMany({
          data: uploadedImages.map((image) => ({
            ...image,
            order: nextOrder++,
          })),
        });
      }

      if (imageOrder.length > 0) {
        await Promise.all(
          imageOrder.map((image) =>
            tx.projectImage.update({
              where: {
                id: image.id,
              },
              data: {
                order: image.order,
              },
            }),
          ),
        );
      }

      await tx.project.update({
        where: {
          id: projectId,
        },
        data: projectData,
      });

      return tx.project.findUnique({
        where: {
          id: projectId,
        },
        include: projectInclude,
      });
    });

    const imagesToDelete = currentProject.images.filter((image) =>
      deletedImages.includes(image.id),
    );

    for (const image of imagesToDelete) {
      await deleteCloudinaryFile(
        image.publicId,
        image.resourceType,
      );
    }

    return project;
  } catch (error) {
    for (const file of uploadedFiles) {
      await deleteCloudinaryFile(
        file.publicId,
        file.resourceType,
      );
    }

    throw error;
  }
}

export async function deleteProject(projectId) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        images: true,
      },
    });

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Project not found",
      );
    }

    for (const image of project.images) {
      await deleteCloudinaryFile(
        image.publicId,
        image.resourceType,
      );
    }

    return await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Project not found",
      );
    }

    throw error;
  }
}