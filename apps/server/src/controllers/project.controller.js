import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

import {
  getAllProjects as getAllProjectsService,
  getProject as getProjectService,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/project.service.js";

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await getAllProjectsService(req.query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      projects,

      "Projects retrieved successfully",
    ),
  );
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectService(req.params.id);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      project,

      "Project retrieved successfully",
    ),
  );
});

export const createProject = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  
  const project = await createProjectService(
    data,
    req.files ?? [],
  );

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,

      project,

      "Project created successfully",
    ),
  );
});

export const updateProject = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  const projects = await updateProjectService(
    data,
    req.params.id,
    req.files ?? []
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      projects,

      "Project updated successfully",
    ),
  );
});

export const deleteProject = asyncHandler(async (req, res) => {
  const projects = await deleteProjectService(req.params.id);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      projects,

      "Project deleted successfully",
    ),
  );
});
