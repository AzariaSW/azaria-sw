import authConfig from "../config/auth.config.js";
import { compare } from "../utils/hash.js";
import { sign, verify } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export async function verifySequence(sequence) {
  const valid = await compare(
    sequence,

    authConfig.sequenceHash,
  );

  if (!valid) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,

      "Invalid challenge.",
    );
  }

  return sign(
    {
      type: "challenge",

      authorized: true,
    },

    authConfig.challengeExpiresIn,
  );
}

export async function verifyCredentials(username, password, challengeToken) {
  const payload = verify(challengeToken);

  if (payload.type !== "challenge" || payload.authorized !== true) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,

      "Invalid challenge.",
    );
  }

  const validPassword = await compare(password, authConfig.passwordHash);

  if (username !== authConfig.username || !validPassword) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,

      "Invalid credentials.",
    );
  }

  return sign(
    {
      role: "admin",

      username,

      type:"access"
    },

    authConfig.jwtExpiresIn,
  );
}
