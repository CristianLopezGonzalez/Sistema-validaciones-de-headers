import { Response, Request, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  console.error("unexpected error:", err);

  return res.status(500).json({
    status: "error",
    statusCode: 500,
    message:
      env.NODE_ENV === "development" ? err.message : "Internal server error",
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};
