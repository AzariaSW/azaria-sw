import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";

export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,

      params: req.params,

      query: req.query,
    });

    if (!result.success) {
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,

          "Validation failed",

          result.error.errors,
        ),
      );
    }

    req.validated = result.data;

    next();
  };
}
