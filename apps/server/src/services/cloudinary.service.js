import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

function bufferToStream(buffer) {
  return Readable.from(buffer);
}

function getResourceType(mimetype) {
  if (mimetype.startsWith("image/")) {
    return "image";
  }

  return "raw";
}

export function uploadFile(file, destination, publicId) {
  return new Promise((resolve, reject) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    const resourceType = getResourceType(file.mimetype);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: destination,
        public_id: publicId,
        overwrite: true,
        use_filename: false,
        unique_filename: false,
        format: extension,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    bufferToStream(file.buffer).pipe(stream);
  });
}

export async function deleteCloudinaryFile(publicId, resourceType = "image") {
  if (!publicId) {
    return;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}
