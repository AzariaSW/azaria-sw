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
      console.log("VALIDATION ERROR:", result.error.flatten());
      console.log("REQUEST BODY:", req.body);
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,

          "VALIDATION ERROR:". result.error.flatten(),

          result.error.errors,
        ),
      );
    }

    req.validated = result.data;

    next();
  };
}
