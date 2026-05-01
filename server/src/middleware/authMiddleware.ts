import type { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/auth";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!req.session || req.session.userId !== decoded.id) {
      return res.status(401).json({ message: "Session invalid or expired" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;
