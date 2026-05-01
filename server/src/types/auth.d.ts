import { Request } from "express";
import { AuthTokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
  session: any; // Add session property to avoid TS errors
}
