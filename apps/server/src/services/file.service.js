import fs from "fs/promises";
import path from "path";
import { fileTypeFromFile } from "file-type";

import { UPLOAD } from "../config/upload.config.js";

async function verifyFileType(filePath, allowedMimeTypes) {
  const type = await fileTypeFromFile(filePath);

  if (!type) {
    return false;
  }

  return allowedMimeTypes.includes(type.mime);
}

export async function validateUploadedFile(file, allowedTypes) {
  const valid = await verifyFileType(file.path, allowedTypes);

  if (!valid) {
    await deleteFile(file.path);

    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "File contents do not match the expected file type.",
    );
  }
}

export async function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function deleteUploadedFile(fileUrl) {
  if (!fileUrl) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/+/, "");

  await deleteFile(path.join(UPLOAD.BASE_DIRECTORY, relativePath));
}

export async function createDirectory(directory) {
  await fs.mkdir(directory, {
    recursive: true,
  });
}

export async function moveFile(oldPath, newPath) {
  const absoluteOldPath = path.isAbsolute(oldPath)
    ? oldPath
    : path.resolve(process.cwd(), oldPath);

  const absoluteNewPath = path.isAbsolute(newPath)
    ? newPath
    : path.resolve(process.cwd(), newPath);

  await fs.rename(absoluteOldPath, absoluteNewPath);

  return true;
}

export async function deleteDirectory(directoryPath) {
  if (!directoryPath) {
    return;
  }

  try {
    const absolutePath = path.isAbsolute(directoryPath)
      ? directoryPath
      : path.resolve(
          process.cwd(),
          directoryPath.startsWith("/")
            ? directoryPath.slice(1)
            : directoryPath,
        );

    await fs.rm(absolutePath, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}
