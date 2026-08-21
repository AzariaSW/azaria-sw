import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteFile } from "../services/file.service.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  getProfile as getProfileService,
  updateProfile as updateProfileService,
} from "../services/profile.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileService();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      profile,

      "Profile retrieved successfully",
    ),
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = { ...req.validated.body };
  const profile = await updateProfileService(data, req.files ?? []);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,

      profile,

      "Profile updated.",
    ),
  );
});
