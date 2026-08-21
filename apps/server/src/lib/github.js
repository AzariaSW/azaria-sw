import github from "../config/github.config.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": github.USER_AGENT,
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export async function githubRequest(endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, github.TIMEOUT);

  try {
    const response = await fetch(
      `${github.API_URL}${endpoint}`,

      {
        headers,
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "GitHub resource not found.");
      }

      if (response.status === 403 || response.status === 429) {
        throw new ApiError(
          HTTP_STATUS.TOO_MANY_REQUESTS,
          "GitHub API rate limit exceeded.",
        );
      }

      if (response.status >= 500) {
        throw new ApiError(
          HTTP_STATUS.SERVICE_UNAVAILABLE,
          "GitHub service temporarily unavailable.",
        );
      }

      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "GitHub request failed.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "GitHub request timed out.",
      );
    }

    throw new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "Unable to connect to GitHub.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
