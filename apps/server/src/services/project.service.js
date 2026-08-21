import path from "path";
import prisma from "../prisma/client.js";

import { queryBuilder } from "./query.service.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  createDirectory,
  deleteFile,
  deleteUploadedFile,
  moveFile,
  deleteDirectory,
} from "./file.service.js";
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

    allowedSortFields: ["title", "description", "createdAt", "updatedAt","featured"],

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
  let projectDirectory;

  try {
    const projectId = crypto.randomUUID();

    projectDirectory = path.join(
      UPLOAD.BASE_DIRECTORY,
      UPLOAD.DESTINATIONS.PROJECTS,
      projectId,
    );

    await createDirectory(projectDirectory);

    for (const file of files) {
      await moveFile(file.path, path.join(projectDirectory, file.filename));
    }

    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          id: projectId,
          ...data,
        },
      });

      if (files.length > 0) {
        await tx.projectImage.createMany({
          data: files.map((file, index) => ({
            projectId,
            url: `/${UPLOAD.DESTINATIONS.PROJECTS}/${projectId}/${file.filename}`,
            order: index + 1,
          })),
        });
      }

      return tx.project.findUnique({
        where: { id: projectId },
        include: projectInclude,
      });
    });
  } catch (error) {
    if (projectDirectory) {
      await deleteDirectory(projectDirectory);
    }

    for (const file of files) {
      await deleteFile(file.path);
    }

    throw error;
  }
}

export async function updateProject(data, projectId, files) {
  const { deletedImages = [], imageOrder = [], ...projectData } = data;

  let projectDirectory;
  const movedFiles = [];

  try {
    const currentProject = await getProject(projectId);

    projectDirectory = path.join(
      UPLOAD.BASE_DIRECTORY,
      UPLOAD.DESTINATIONS.PROJECTS,
      projectId,
    );
    await createDirectory(projectDirectory);

    for (const file of files) {
      const destination = path.join(projectDirectory, file.filename);

      await moveFile(file.path, destination);

      movedFiles.push(destination);
    }

    const project = await prisma.$transaction(async (tx) => {
      if (deletedImages.length > 0) {
        await tx.projectImage.deleteMany({
          where: {
            id: {
              in: deletedImages,
            },
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

      let nextOrder = lastImage ? lastImage.order + 1 : 1;

      if (files.length > 0) {
        await tx.projectImage.createMany({
          data: files.map((file) => ({
            projectId,

            url: `/${UPLOAD.DESTINATIONS.PROJECTS}/${projectId}/${file.filename}`,

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
      await deleteUploadedFile(image.url);
    }

    return project;
  } catch (error) {
    for (const file of movedFiles) {
      await deleteFile(file);
    }

    for (const file of files) {
      if (!movedFiles.includes(path.join(projectDirectory, file.filename))) {
        await deleteFile(file.path);
      }
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

    const projectDirectory = path.join(
      UPLOAD.BASE_DIRECTORY,
      UPLOAD.DESTINATIONS.PROJECTS,
      projectId,
    );
    await deleteDirectory(projectDirectory);

    return prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found");
    }
    throw error;
  }
}
