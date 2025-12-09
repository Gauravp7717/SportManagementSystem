import { apiError } from "../utils/apiError.js";

export const authrizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new apiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new apiError(
        403,
        "Forbidden: You don't have enough permissions to access this resource"
      );
    }

    next();
  };
};
