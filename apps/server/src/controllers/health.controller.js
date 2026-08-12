import { checkDatabase as checkDatabaseService } from "../services/health.service.js";
import { HTTP_STATUS } from "../constants/index.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createSlug } from "../utils/slug.js";

import { getPagination } from "../utils/pagination.js";

export const CheckDatabase = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  await checkDatabaseService();
  
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        status: "healthy",
        database: "connected",
        uptime: process.uptime(),
        responseTime: `${Date.now() - startTime}ms`,
      },
      "Health check successful",
    ),
  );
});
