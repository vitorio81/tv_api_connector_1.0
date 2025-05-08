import { Request, Response, NextFunction } from "express";
import { HttpError } from "../error/http_error";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
  } else {
    res.status(400).json({ message: error.message || "Erro desconhecido" });
  }
}
