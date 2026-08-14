import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import ApiError from "../utils/ApiError.js";
import parseJsonField from "../utils/parseJsonField.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

import { UPLOAD } from "../config/upload.config.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    let folder;

    switch (file.fieldname) {
      case "profileImage":
        folder = UPLOAD.DESTINATIONS.PROFILE;
        break;

      case "resume":
        folder = UPLOAD.DESTINATIONS.RESUME;
        break;

      case "cv":
        folder = UPLOAD.DESTINATIONS.CV;
        break;

      case "images":
        folder = UPLOAD.DESTINATIONS.TEMP;
        break;

      case "image":
        folder = UPLOAD.DESTINATIONS.CERTIFICATES;
        break;

      default:
        return cb(
          new ApiError(HTTP_STATUS.BAD_REQUEST, "Unexpected upload field."),
        );
    }

    const destination = path.join(UPLOAD.BASE_DIRECTORY, folder);

    fs.mkdirSync(destination, {
      recursive: true,
    });

    cb(null, destination);
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  let allowedTypes;
  let allowedExtensions;

  switch (file.fieldname) {
    case "profileImage":
    case "image":
      allowedTypes = UPLOAD.IMAGE_TYPES;
      allowedExtensions = UPLOAD.IMAGE_EXTENSIONS;
      break;

    case "resume":
    case "cv":
      allowedTypes = UPLOAD.DOCUMENT_TYPES;
      allowedExtensions = UPLOAD.DOCUMENT_EXTENSIONS;
      break;

    case "images":
      allowedTypes = UPLOAD.IMAGE_TYPES;
      allowedExtensions = UPLOAD.IMAGE_EXTENSIONS;
      break;

    default:
      return cb(
        new ApiError(HTTP_STATUS.BAD_REQUEST, "Unexpected upload field."),
      );
  }

  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid file extension."));
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Unsupported file type."));
  }

  cb(null, true);
}

function createUploader() {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: UPLOAD.MAX_FILE_SIZE,
    },
  });
}

export const uploader = createUploader();

export function handleUpload(upload) {
  return (req, res, next) => {
    upload(req, res, function (error) {
      if (error) {
        if (error instanceof multer.MulterError) {
          switch (error.code) {
            case "LIMIT_FILE_SIZE":
              return next(
                new ApiError(
                  HTTP_STATUS.BAD_REQUEST,
                  "File exceeds maximum allowed size.",
                ),
              );

            case "LIMIT_UNEXPECTED_FILE":
              return next(
                new ApiError(
                  HTTP_STATUS.BAD_REQUEST,
                  "Unexpected uploaded file.",
                ),
              );

            default:
              return next(new ApiError(HTTP_STATUS.BAD_REQUEST, error.message));
          }
        }

        return next(error);
      }
      req.body.deletedImages = parseJsonField(req.body.deletedImages);
      req.body.imageOrder = parseJsonField(req.body.imageOrder);

      next();
    });
  };
}
