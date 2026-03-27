import { Response, Request, NextFunction } from "express";

export async function validateReqBody(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
    if (!req.body) {
      return res
        .json({ error: "Please include a body in your POST req" })
        .status(400);
    } else if (Object.keys(req.body).length === 0) {
      return res
        .json({ error: "Please include a non-empty body in your POST req" })
        .status(400);
    } else next();
  } else next();
}
